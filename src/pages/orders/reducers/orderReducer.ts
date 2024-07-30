import {
    FETCH_SELLER_ORDERS_REQUEST,
    FETCH_SELLER_ORDERS_SUCCESS,
    FETCH_SELLER_ORDERS_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE, FETCH_ORDER_DETAILS_REQUEST, FETCH_ORDER_DETAILS_SUCCESS, FETCH_ORDER_DETAILS_FAILURE
} from '../constants/actionTypes';

interface OrderState {
    loading: boolean;
    data: any[];
    orderDetails: any | null;
    error: string | null;
}

const initialState: OrderState = {
    loading: false,
    data: [],
    orderDetails: null,
    error: null
};

const orderReducer = (state = initialState, action: any): OrderState => {
    switch (action.type) {
        case FETCH_SELLER_ORDERS_REQUEST:
        case UPDATE_ORDER_STATUS_REQUEST:
        case FETCH_ORDER_DETAILS_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_SELLER_ORDERS_SUCCESS:
            return { ...state, loading: false, data: action.payload, error: null };
        case UPDATE_ORDER_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: state.data.map(order =>
                    order.id === action.payload.id ? action.payload : order
                ),
                error: null
            };
        case FETCH_ORDER_DETAILS_SUCCESS:
            return { ...state, loading: false, orderDetails: action.payload, error: null };
        case FETCH_SELLER_ORDERS_FAILURE:
        case UPDATE_ORDER_STATUS_FAILURE:
        case FETCH_ORDER_DETAILS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default orderReducer;