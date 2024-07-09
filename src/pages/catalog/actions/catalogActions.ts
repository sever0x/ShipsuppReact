import { Dispatch } from 'redux';
import {ref, get, update} from 'firebase/database';
import * as actionTypes from '../constants/actionTypes';
import storage from "misc/storage";
import { storage as firebaseStorage, database } from 'app/config/firebaseConfig';
import {Good} from "pages/catalog/types/Good";
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

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

export const fetchGoods = (categoryId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: actionTypes.FETCH_GOODS_REQUEST });

    try {
        const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
        const portId = userData.port?.id;
        const userId = userData.id;

        if (!portId || !userId) {
            throw new Error('User port or ID not found');
        }

        const goodsRef = ref(database, `goods/${portId}`);
        const snapshot = await get(goodsRef);

        if (snapshot.exists()) {
            const allGoods = snapshot.val() as Record<string, Record<string, Good>>;
            const filteredGoods = Object.values(allGoods)
                .flatMap(userGoods =>
                    Object.values(userGoods)
                        .filter((good: Good) =>
                            good.categoryId === categoryId && good.ownerId === userId
                        )
                );

            dispatch({
                type: actionTypes.FETCH_GOODS_SUCCESS,
                payload: filteredGoods
            });
        } else {
            dispatch({
                type: actionTypes.FETCH_GOODS_SUCCESS,
                payload: []
            });
        }
    } catch (error) {
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
        const portId = userData.port?.id;
        const userId = userData.id;

        if (!portId || !userId) {
            throw new Error('User port or ID not found');
        }

        // Upload new images
        const uploadedImages = await Promise.all(newImages.map(async (file) => {
            const uniqueFileName = `${uuidv4()}_${file.name.replace(/[.#$\/\[\]]/g, '_')}`;
            const imageRef = storageRef(firebaseStorage, `goods/${portId}/${userId}/${updatedGood.id}/${uniqueFileName}`);
            await uploadBytes(imageRef, file);
            const downloadURL = await getDownloadURL(imageRef);
            return { [uniqueFileName]: downloadURL };
        }));

        // Remove deleted images
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
            images: mergedImages
        };

        const goodRef = ref(database, `goods/${portId}/${userId}/${updatedGood.id}`);
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