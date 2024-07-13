import {
    FETCH_SELLER_ORDERS_REQUEST,
    FETCH_SELLER_ORDERS_SUCCESS,
    FETCH_SELLER_ORDERS_FAILURE,
    UPDATE_ORDER_STATUS_REQUEST,
    UPDATE_ORDER_STATUS_SUCCESS,
    UPDATE_ORDER_STATUS_FAILURE
} from '../constants/actionTypes';

interface OrderState {
    loading: boolean;
    data: any[];
    error: string | null;
}

const initialState: OrderState = {
    loading: false,
    data: [],
    error: null
};

const orderReducer = (state = initialState, action: any): OrderState => {
    switch (action.type) {
        case FETCH_SELLER_ORDERS_REQUEST:
        case UPDATE_ORDER_STATUS_REQUEST:
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
        case FETCH_SELLER_ORDERS_FAILURE:
        case UPDATE_ORDER_STATUS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default orderReducer;