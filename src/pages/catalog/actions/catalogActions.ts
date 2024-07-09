import { Dispatch } from 'redux';
import {ref, get, update} from 'firebase/database';
import { database } from 'app/config/firebaseConfig';
import * as actionTypes from '../constants/actionTypes';
import storage from "misc/storage";
import {Good} from "pages/catalog/types/Good";

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

export const updateGood = (updatedGood: Good) => async (dispatch: Dispatch) => {
    dispatch({ type: actionTypes.UPDATE_GOOD_REQUEST });

    try {
        const userData = JSON.parse(storage.getItem(storage.keys.USER_DATA) ?? '{}');
        const portId = userData.port?.id;
        const userId = userData.id;

        if (!portId || !userId) {
            throw new Error('User port or ID not found');
        }

        const goodRef = ref(database, `goods/${portId}/${userId}/${updatedGood.id}`);
        await update(goodRef, updatedGood);

        dispatch({
            type: actionTypes.UPDATE_GOOD_SUCCESS,
            payload: updatedGood
        });
    } catch (error) {
        dispatch({
            type: actionTypes.UPDATE_GOOD_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};