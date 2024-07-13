import {
    FETCH_SELLER_ORDERS_REQUEST,
    FETCH_SELLER_ORDERS_SUCCESS,
    FETCH_SELLER_ORDERS_FAILURE
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
            return { ...state, loading: true, error: null };
        case FETCH_SELLER_ORDERS_SUCCESS:
            return { ...state, loading: false, data: action.payload, error: null };
        case FETCH_SELLER_ORDERS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default orderReducer;