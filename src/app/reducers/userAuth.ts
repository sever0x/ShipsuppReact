import {
    ERROR_SIGN_IN,
    REQUEST_SIGN_IN,
    SUCCESS_SIGN_IN,
    REQUEST_SIGN_OUT,
    SUCCESS_SIGN_OUT,
    ERROR_SIGN_UP,
    REQUEST_SIGN_UP,
    SUCCESS_SIGN_UP,
} from '../constants/actionTypes';
import {User} from "firebase/auth";

export interface AuthState {
    user: User | null;
    loading: boolean;
    error: any;
}

const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
};

export default function authReducer(state = initialState, action: any): AuthState {
    switch (action.type) {
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
            };
        case ERROR_SIGN_IN:
        case ERROR_SIGN_UP:
            return {
                ...state,
                loading: false,
                error: action.payload,
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
            };
        case SUCCESS_SIGN_UP:
            return {
                ...state,
                loading: false,
                error: null,
            };
        default:
            return state;
    }
}
