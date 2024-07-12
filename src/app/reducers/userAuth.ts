import {
    AUTH_STATE_CHANGED,
    ERROR_SIGN_IN,
    ERROR_SIGN_UP,
    REQUEST_SIGN_IN,
    REQUEST_SIGN_OUT,
    REQUEST_SIGN_UP,
    SUCCESS_SIGN_IN,
    SUCCESS_SIGN_OUT,
    SUCCESS_SIGN_UP,
} from '../constants/actionTypes';

export interface AuthState {
    user: {
        uid: string;
        email: string | null;
        displayName: string | null;
        photoURL: string | null;
    } | null;
    loading: boolean;
    error: any;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const initialState: AuthState = {
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    isLoading: true,
};


export default function authReducer(state = initialState, action: any): AuthState {
    switch (action.type) {
        case AUTH_STATE_CHANGED:
            return {
                ...state,
                isLoading: false,
                isAuthenticated: !!action.payload,
                user: action.payload,
            };
        case REQUEST_SIGN_IN:
        case REQUEST_SIGN_UP:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case SUCCESS_SIGN_IN:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
                isAuthenticated: true,
            };
        case ERROR_SIGN_IN:
        case ERROR_SIGN_UP:
            return {
                ...state,
                loading: false,
                error: action.payload,
                isAuthenticated: false,
            };
        case REQUEST_SIGN_OUT:
            return {
                ...state,
                loading: true,
            };
        case SUCCESS_SIGN_OUT:
            return {
                ...state,
                user: null,
                loading: false,
                error: null,
                isAuthenticated: false,
            };
        case SUCCESS_SIGN_UP:
            return {
                ...state,
                loading: false,
                error: null,
                isAuthenticated: true,
            };
        default:
            return state;
    }
}
