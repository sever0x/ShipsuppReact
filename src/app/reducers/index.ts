import { combineReducers } from 'redux';
import userAuth, { AuthState } from './userAuth';

const rootReducer = combineReducers({
    userAuth,
});

export type RootState = {
    userAuth: AuthState;
};

export default rootReducer;