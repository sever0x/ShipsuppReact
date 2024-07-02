import {
    FETCH_PROFILE_REQUEST,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAILURE
} from '../constants/actionTypes';

interface ProfileState {
    loading: boolean;
    data: any;
    error: string | null;
}

const initialState: ProfileState = {
    loading: false,
    data: null,
    error: null
};

const profileReducer = (state = initialState, action: any): ProfileState => {
    switch (action.type) {
        case FETCH_PROFILE_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_PROFILE_SUCCESS:
            return { ...state, loading: false, data: action.payload, error: null };
        case FETCH_PROFILE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default profileReducer;