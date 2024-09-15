import {Dispatch} from 'redux';
import {deleteObject, getDownloadURL, ref as storageRef, uploadBytes} from 'firebase/storage';
import {get, ref, set, update} from 'firebase/database';
import * as actionTypes from '../constants/actionTypes';
import storage from "misc/storage";
import {database, storage as firebaseStorage} from 'app/config/firebaseConfig';
import {Good} from "pages/catalog/types/Good";
import {v4 as uuidv4} from 'uuid';
import logger from 'app/utility/logger';
import axios from "axios";
import {BACKEND_SERVICE} from "../../../constants/api";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchCategories = () => async (dispatch: Dispatch) => {
    dispatch({ type: actionTypes.FETCH_CATEGORIES_REQUEST });

    try {
        const categoriesRef = ref(database, 'categories');
        const snapshot = await get(categoriesRef);

        if (snapshot.exists()) {
            dispatch({
                type: actionTypes.FETCH_CATEGORIES_SUCCESS,
                payload: snapshot.val()
            });
        } else {
            throw new Error('No categories found');
        }
    } catch (error) {
        dispatch({
            type: actionTypes.FETCH_CATEGORIES_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const fetchGoods = (categoryId?: string, portId?: string | null) => async (dispatch: Dispatch) => {
    dispatch({ type: actionTypes.FETCH_GOODS_REQUEST });

    try {
        // Wait for portId to become non-null
        let attempts = 0;
        const maxAttempts = 10; // Adjust as needed
        while (portId === null && attempts < maxAttempts) {
            logger.info(`Waiting for portId... Attempt ${attempts + 1}`);
            await delay(1000); // Wait for 1 second before trying again
            attempts++;
            // Re-fetch portId from storage or wherever it's being set
            const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
            portId = userData.selectedPortId; // Adjust this line based on how portId is stored
        }

        if (portId === null) {
            throw new Error('Port ID is still null after maximum attempts');
        }

        logger.info(`fetchGoods: selected portId = ${portId}`);

        const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
        const sellerId = userData.id;

        if (!sellerId) {
            throw new Error('Seller ID not found');
        }

        const response = await axios.get(`${BACKEND_SERVICE}/getGoods`, {
            params: {
                portId: portId,
                ownerId: sellerId
            }
        });

        let goods: Good[] = [];

        if (typeof response.data.data === 'object' && response.data.data !== null) {
            // If the response is an object, convert it to an array
            goods = Object.values(response.data.data);
        } else {
            throw new Error('Unexpected data format received from server');
        }

        if (categoryId) {
            goods = goods.filter(good => good.categoryId === categoryId);
        }

        logger.info(`Fetched ${goods.length} goods${categoryId ? ` for category ${categoryId}` : ''}`);

        dispatch({
            type: actionTypes.FETCH_GOODS_SUCCESS,
            payload: goods
        });
    } catch (error) {
        logger.error('Error fetching goods:', error);
        dispatch({
            type: actionTypes.FETCH_GOODS_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const updateGood = (updatedGood: Good, newImages: File[], deletedImageKeys: string[]) => async (dispatch: Dispatch) => {
    dispatch({ type: actionTypes.UPDATE_GOOD_REQUEST });

    try {
        const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
        const userId = userData.id;

        if (!userId) {
            throw new Error('User ID not found');
        }

        // Upload new images
        const uploadedImages = await Promise.all(newImages.map(async (file) => {
            const uniqueFileName = `${uuidv4()}_${file.name.replace(/[.#$\/\[\]]/g, '_')}`;
            const imageRef = storageRef(firebaseStorage, `goods/${updatedGood.portId}/${userId}/${updatedGood.id}/${uniqueFileName}`);
            await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(imageRef);
            return { [uniqueFileName]: downloadURL };
        }));

        // Delete removed images from Firebase Storage
        await Promise.all(deletedImageKeys.map(async (key) => {
            const imageRef = storageRef(firebaseStorage, `goods/${updatedGood.portId}/${userId}/${updatedGood.id}/${key}`);
            await deleteObject(imageRef);
        }));

        // Remove deleted images from the good object
        const filteredImages = Object.entries(updatedGood.images || {})
            .filter(([key]) => !deletedImageKeys.includes(key))
            .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

        // Merge new images with existing ones
        const mergedImages = {
            ...filteredImages,
            ...Object.assign({}, ...uploadedImages)
        };

        const updatedGoodWithImages = {
            ...updatedGood,
            images: mergedImages,
            portId: updatedGood.portId
        };

        const goodRef = ref(database, `goods/${updatedGood.portId}/${userId}/${updatedGood.id}`);
        await update(goodRef, updatedGoodWithImages);

        dispatch({
            type: actionTypes.UPDATE_GOOD_SUCCESS,
            payload: updatedGoodWithImages
        });
    } catch (error) {
        dispatch({
            type: actionTypes.UPDATE_GOOD_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const deleteGood = (good: Good) => async (dispatch: Dispatch) => {
    dispatch({ type: actionTypes.DELETE_GOOD_REQUEST });

    try {
        const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
        const userId = userData.id;

        if (!userId) {
            throw new Error('User ID not found');
        }

        // Update good in Firebase Realtime Database to set available: false
        const goodRef = ref(database, `goods/${good.portId}/${userId}/${good.id}`);
        await update(goodRef, { available: false });

        dispatch({
            type: actionTypes.DELETE_GOOD_SUCCESS,
            payload: { ...good, available: false }
        });

        logger.info(`Good ${good.id} marked as unavailable`);
    } catch (error) {
        logger.error('Error marking good as unavailable:', error);
        dispatch({
            type: actionTypes.DELETE_GOOD_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const addGood = (newGood: Omit<Good, 'id'>, newImages: File[]) => async (dispatch: Dispatch) => {
    dispatch({ type: actionTypes.ADD_GOOD_REQUEST });

    try {
        const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
        const userId = userData.id;

        if (!userId) {
            throw new Error('User ID not found');
        }

        const goodId = uuidv4();

        // Upload new images
        const uploadedImages = await Promise.all(newImages.map(async (file) => {
            const uniqueFileName = `${uuidv4()}_${file.name.replace(/[.#$\/\[\]]/g, '_')}`;
            const imageRef = storageRef(firebaseStorage, `goods/${newGood.portId}/${userId}/${goodId}/${uniqueFileName}`);
            await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(imageRef);
            return { [uniqueFileName]: downloadURL };
        }));

        const goodWithImages = {
            ...newGood,
            id: goodId,
            images: Object.assign({}, ...uploadedImages),
            ownerId: userId,
            portId: newGood.portId,
            createTimestampGMT: new Date().toISOString(),
            available: true,
        };

        const goodRef = ref(database, `goods/${newGood.portId}/${userId}/${goodId}`);
        await set(goodRef, goodWithImages);

        dispatch({
            type: actionTypes.ADD_GOOD_SUCCESS,
            payload: goodWithImages
        });
    } catch (error) {
        dispatch({
            type: actionTypes.ADD_GOOD_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};