import * as actionTypes from '../constants/actionTypes';

interface CatalogState {
    categories: any[];
    loading: boolean;
    error: string | null;
}

const initialState: CatalogState = {
    categories: [],
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
        default:
            return state;
    }
};

export default catalogReducer;