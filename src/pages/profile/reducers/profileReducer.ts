import {
    FETCH_PROFILE_FAILURE,
    FETCH_PROFILE_REQUEST,
    FETCH_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    UPDATE_PROFILE_PHOTO_FAILURE,
    UPDATE_PROFILE_PHOTO_REQUEST,
    UPDATE_PROFILE_PHOTO_SUCCESS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS
} from '../constants/actionTypes';

interface ProfileState {
    loading: boolean;
    data: any;
    error: string | null;
    uploadingPhoto: boolean;
    updatingProfile: boolean;
}

const initialState: ProfileState = {
    loading: false,
    data: null,
    error: null,
    uploadingPhoto: false,
    updatingProfile: false
};

const profileReducer = (state = initialState, action: any): ProfileState => {
    switch (action.type) {
        case FETCH_PROFILE_REQUEST:
            return { ...state, loading: true, error: null };
        case FETCH_PROFILE_SUCCESS:
            return { ...state, loading: false, data: action.payload, error: null };
        case FETCH_PROFILE_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case UPDATE_PROFILE_PHOTO_REQUEST:
            return { ...state, uploadingPhoto: true, error: null };
        case UPDATE_PROFILE_PHOTO_SUCCESS:
            return {
                ...state,
                uploadingPhoto: false,
                data: { ...state.data, ...action.payload },
                error: null
            };
        case UPDATE_PROFILE_PHOTO_FAILURE:
            return { ...state, uploadingPhoto: false, error: action.payload };
        case UPDATE_PROFILE_REQUEST:
            return { ...state, updatingProfile: true, error: null };
        case UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                updatingProfile: false,
                data: { ...state.data, ...action.payload },
                error: null
            };
        case UPDATE_PROFILE_FAILURE:
            return { ...state, updatingProfile: false, error: action.payload };
        default:
            return state;
    }
};

export default profileReducer;