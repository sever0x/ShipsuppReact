import { combineReducers } from 'redux';
import userAuth, { AuthState } from './userAuth';
import profile from '../../pages/profile/reducers/profileReducer';

const rootReducer = combineReducers({
    userAuth,
    profile
});

export type RootState = {
    userAuth: AuthState;
    profile: ReturnType<typeof profile>;
};

export default rootReducer;