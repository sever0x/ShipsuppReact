import {Dispatch} from 'redux';
import {get, ref, update} from 'firebase/database';
import {auth, database} from 'app/config/firebaseConfig';
import {
    FETCH_ORDER_DETAILS_FAILURE,
    FETCH_ORDER_DETAILS_REQUEST,
    FETCH_ORDER_DETAILS_SUCCESS,
    FETCH_SELLER_ORDERS_FAILURE,
    FETCH_SELLER_ORDERS_REQUEST,
    FETCH_SELLER_ORDERS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS
} from '../constants/actionTypes';
import {getIdToken} from "firebase/auth";
import axios from "axios";
import {Order} from "pages/orders/types/Order";
import {BACKEND_SERVICE} from "../../../constants/api";

const excludedStatuses = ['ADD_TO_CART', 'CANCEL_BY_BUYER'];

export const fetchSellerOrders = (sellerId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_SELLER_ORDERS_REQUEST });

    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User not authenticated");
        }

        const token = await getIdToken(user);
        const response = await axios.get(`${BACKEND_SERVICE}/getOrders?userId=${sellerId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        if (response.data.error === null && response.data.message === 'success') {
            const orders: Order[] = response.data.data;

            const filteredOrders = orders.filter((order: Order) => !excludedStatuses.includes(order.status));

            const sortedOrders = [...filteredOrders].sort((a: Order, b: Order) =>
                new Date(b.createTimestampGMT).getTime() - new Date(a.createTimestampGMT).getTime()
            );

            dispatch({
                type: FETCH_SELLER_ORDERS_SUCCESS,
                payload: sortedOrders
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

export const fetchOrderDetails = (orderId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_ORDER_DETAILS_REQUEST });

    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User not authenticated");
        }

        const token = await getIdToken(user);

        const response = await axios.get(`${BACKEND_SERVICE}/getOrderDetails`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                userId: user.uid,
                orderId: orderId,
            }
        });

        const order: Order = response.data.data;

        dispatch({
            type: FETCH_ORDER_DETAILS_SUCCESS,
            payload: order
        });
    } catch (error) {
        dispatch({
            type: FETCH_ORDER_DETAILS_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const updateOrderStatus = (orderId: string, newStatus: string) => async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

    try {
        const orderRef = ref(database, `orders/${orderId}`);
        const snapshot = await get(orderRef);
        if (snapshot.exists()) {
            const order = snapshot.val();
            const updatedOrder = {
                ...order,
                status: newStatus,
                datesOfStatusChange: {
                    ...order.datesOfStatusChange,
                    [newStatus]: new Date().toISOString()
                }
            };
            await update(orderRef, updatedOrder);
            dispatch({
                type: UPDATE_ORDER_STATUS_SUCCESS,
                payload: updatedOrder
            });
        } else {
            throw new Error('Order not found');
        }
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_STATUS_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};