import {
    ADD_PORT_FAILURE,
    ADD_PORT_REQUEST, ADD_PORT_SUCCESS,
    CHANGE_PASSWORD_FAILURE,
    CHANGE_PASSWORD_REQUEST,
    CHANGE_PASSWORD_SUCCESS,
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
    changingPassword: boolean;
    addingPort: boolean;
}

const initialState: ProfileState = {
    loading: false,
    data: null,
    error: null,
    uploadingPhoto: false,
    updatingProfile: false,
    changingPassword: false,
    addingPort: false,
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
        case CHANGE_PASSWORD_REQUEST:
            return { ...state, changingPassword: true, error: null };
        case CHANGE_PASSWORD_SUCCESS:
            return { ...state, changingPassword: false, error: null };
        case CHANGE_PASSWORD_FAILURE:
            return { ...state, changingPassword: false, error: action.payload };
        case ADD_PORT_REQUEST:
            return { ...state, addingPort: true, error: null };
        case ADD_PORT_SUCCESS:
            return {
                ...state,
                addingPort: false,
                error: null
            };
        case ADD_PORT_FAILURE:
            return { ...state, addingPort: false, error: action.payload };
        default:
            return state;
    }
};

export default profileReducer;