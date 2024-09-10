import {Dispatch} from 'redux';
import {auth} from 'app/config/firebaseConfig';
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
        const response = await axios.get(`${BACKEND_SERVICE}/getOrders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                userId: sellerId
            }
        });

        if (response.data.error === null && response.data.message === 'success' && response.data.data !== null) {
            let orders: Order[] = response.data.data;

            // Fetch latest product information for each order
            const updatedOrders = await Promise.all(orders.map(async (order) => {
                const productResponse = await axios.get(`${BACKEND_SERVICE}/getGoodDetails`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    params: {
                        goodId: order.goodId
                    }
                });
                if (productResponse.data.error === null && productResponse.data.message === 'success') {
                    return {
                        ...order,
                        good: {
                            ...order.good,
                            ...productResponse.data.data
                        }
                    };
                }
                return order;
            }));

            const filteredOrders = updatedOrders.filter((order: Order) => !excludedStatuses.includes(order.status));

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

export const updateOrderStatus = (orderId: string, newStatus: string, cancellationReason?: string) => async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_ORDER_STATUS_REQUEST });

    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error("User not authenticated");
        }

        const token = await getIdToken(user);

        let endpoint = '';
        const data: any = {
            userId: user.uid,
            orderId: orderId
        };

        switch (newStatus) {
            case 'APPROVE_BY_SELLER':
                endpoint = 'approveOrder';
                break;
            case 'SENT':
                endpoint = 'sendOrder';
                break;
            case 'ARRIVED':
                endpoint = 'arriveOrder';
                break;
            case 'COMPLETED':
                endpoint = 'completeOrder';
                break;
            case 'CANCEL_BY_SELLER':
                endpoint = 'cancelOrder';
                if (cancellationReason) {
                    data.cancellationReason = cancellationReason;
                }
                break;
            default:
                throw new Error(`Invalid status: ${newStatus}`);
        }

        const response = await axios.post(`${BACKEND_SERVICE}/${endpoint}`, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (response.data.error === null && response.data.message === 'success') {
            dispatch({
                type: UPDATE_ORDER_STATUS_SUCCESS,
                payload: response.data.data
            });
        } else {
            throw new Error(response.data.message || 'Failed to update order status');
        }
    } catch (error) {
        dispatch({
            type: UPDATE_ORDER_STATUS_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};