import * as actionTypes from '../constants/actionTypes';

interface CatalogState {
    categories: any[];
    goods: any[];
    loading: boolean;
    error: string | null;
}

const initialState: CatalogState = {
    categories: [],
    goods: [],
    loading: false,
    error: null
};


const catalogReducer = (state = initialState, action: any): CatalogState => {
    switch (action.type) {
        case actionTypes.FETCH_CATEGORIES_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.FETCH_CATEGORIES_SUCCESS:
            return { ...state, loading: false, categories: action.payload, error: null };
        case actionTypes.FETCH_CATEGORIES_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case actionTypes.FETCH_GOODS_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.FETCH_GOODS_SUCCESS:
            return { ...state, loading: false, goods: action.payload, error: null };
        case actionTypes.FETCH_GOODS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default catalogReducer;