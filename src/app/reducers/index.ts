import { combineReducers } from 'redux';
import userAuth, { AuthState } from './userAuth';
import profile from 'pages/profile/reducers/profileReducer';
import catalog from 'pages/catalog/reducers/catalogReducer';

const rootReducer = combineReducers({
    userAuth,
    profile,
    catalog,
});

export type RootState = {
    userAuth: AuthState;
    profile: ReturnType<typeof profile>;
    catalog: ReturnType<typeof catalog>;
};

export default rootReducer;