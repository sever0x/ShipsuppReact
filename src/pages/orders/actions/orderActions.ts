import { Dispatch } from 'redux';
import { ref, query, orderByChild, equalTo, get, update } from 'firebase/database';
import {auth, database} from 'app/config/firebaseConfig';
import {
    FETCH_SELLER_ORDERS_REQUEST,
    FETCH_SELLER_ORDERS_SUCCESS,
    FETCH_SELLER_ORDERS_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE, FETCH_ORDER_DETAILS_REQUEST, FETCH_ORDER_DETAILS_SUCCESS, FETCH_ORDER_DETAILS_FAILURE
} from '../constants/actionTypes';
import {getIdToken} from "firebase/auth";
import axios from "axios";
import {Order} from "pages/orders/types/Order";

const excludedStatuses = ['ADD_TO_CART', 'CANCEL_BY_BUYER'];

export const fetchSellerOrders = (sellerId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_SELLER_ORDERS_REQUEST });

    try {
        const ordersRef = ref(database, 'orders');
        const sellerOrdersQuery = query(ordersRef, orderByChild('sellerId'), equalTo(sellerId));
        const snapshot = await get(sellerOrdersQuery);

        if (snapshot.exists()) {
            const orders = Object.values(snapshot.val());
            const filteredOrders = orders.filter((order: any) => !excludedStatuses.includes(order.status));
            const sortedOrders = [...filteredOrders].sort((a: any, b: any) =>
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

        const response = await axios.get('https://getorderdetails-br4hzq7ova-uc.a.run.app', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                userId: user.uid,
                orderId: orderId,
            }
        });

        const order: Order = response.data;

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