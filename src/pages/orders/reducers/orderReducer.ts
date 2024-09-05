import {
    FETCH_SELLER_ORDERS_REQUEST,
    FETCH_SELLER_ORDERS_SUCCESS,
    FETCH_SELLER_ORDERS_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE,
    FETCH_ORDER_DETAILS_REQUEST,
    FETCH_ORDER_DETAILS_SUCCESS,
    FETCH_ORDER_DETAILS_FAILURE
} from '../constants/actionTypes';
import { Order } from "pages/orders/types/Order";

interface OrderState {
    loadingOrders: boolean;
    loadingDetails: boolean;
    data: Order[];
    orderDetails: Order | null;
    error: string | null;
}

const initialState: OrderState = {
    loadingOrders: false,
    loadingDetails: false,
    data: [],
    orderDetails: null,
    error: null
};

const orderReducer = (state = initialState, action: any): OrderState => {
    switch (action.type) {
        case FETCH_SELLER_ORDERS_REQUEST:
            return { ...state, loadingOrders: true, error: null };
        case FETCH_ORDER_DETAILS_REQUEST:
            return { ...state, loadingDetails: true, error: null };
        case UPDATE_ORDER_STATUS_REQUEST:
            return { ...state, error: null };
        case FETCH_SELLER_ORDERS_SUCCESS:
            return { ...state, loadingOrders: false, data: action.payload, error: null };
        case UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                data: state.data.map(order =>
                    order.id === action.payload.id ? action.payload : order
                ),
                error: null
            };
        case FETCH_ORDER_DETAILS_SUCCESS:
            return {
                ...state,
                loadingDetails: false,
                orderDetails: action.payload,
                data: state.data.map(order =>
                    order.id === action.payload.id
                        ? { ...order, good: { ...order.good, ...action.payload.good } }
                        : order
                ),
                error: null
            };
        case FETCH_SELLER_ORDERS_FAILURE:
            return { ...state, loadingOrders: false, error: action.payload };
        case UPDATE_ORDER_STATUS_FAILURE:
            return { ...state, error: action.payload };
        case FETCH_ORDER_DETAILS_FAILURE:
            return { ...state, loadingDetails: false, error: action.payload };
        default:
            return state;
    }
};

export default orderReducer;