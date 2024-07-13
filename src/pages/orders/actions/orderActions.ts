import { Dispatch } from 'redux';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { database } from 'app/config/firebaseConfig';
import {
    FETCH_SELLER_ORDERS_REQUEST,
    FETCH_SELLER_ORDERS_SUCCESS,
    FETCH_SELLER_ORDERS_FAILURE
} from '../constants/actionTypes';

export const fetchSellerOrders = (sellerUID: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_SELLER_ORDERS_REQUEST });

    try {
        const ordersRef = ref(database, 'orders');
        const sellerOrdersQuery = query(ordersRef, orderByChild('sellerUID'), equalTo(sellerUID));
        const snapshot = await get(sellerOrdersQuery);

        if (snapshot.exists()) {
            const orders = Object.values(snapshot.val());
            dispatch({
                type: FETCH_SELLER_ORDERS_SUCCESS,
                payload: orders
            });
        } else {
            dispatch({
                type: FETCH_SELLER_ORDERS_SUCCESS,
                payload: []
            });
        }
    } catch (error) {
        dispatch({
            type: FETCH_SELLER_ORDERS_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};