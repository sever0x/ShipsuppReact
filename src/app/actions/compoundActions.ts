import {ThunkAction} from 'redux-thunk';
import {RootState} from '../reducers';
import {UnknownAction} from 'redux';
import actions from "../../app/actions/userAuth";
import {fetchUserProfile} from "pages/profile/actions/profileActions";
import { Port } from 'misc/types/Port';

export const signInAndLoadProfile = (email: string, password: string): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        await dispatch(actions.fetchLogin(email, password) as any);
        const user = JSON.parse(localStorage.getItem('safeUser') ?? '{}');
        if (user.uid) {
            await dispatch(fetchUserProfile(user.uid) as any);
        }
    };

export const googleSignInAndLoadProfile = (): ThunkAction<Promise<{ isNewUser: boolean, email: string, firstName: string, lastName: string }>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        const result = await dispatch(actions.fetchGoogleSignIn() as any);
        const user = JSON.parse(localStorage.getItem('safeUser') ?? '{}');
        if (user.uid) {
            await dispatch(fetchUserProfile(user.uid) as any);
        }
        return result;
    };

export const signUpAndLoadProfile = (
    email: string,
    password: string,
    additionalInfo: {
        firstName: string,
        lastName: string,
        phone: string,
        vesselIMO: string,
        vesselMMSI: string,
        ports: { [key: string]: Port },
        referral: string,
    }
) => async (dispatch: (arg0: any) => any) => {
    await dispatch(actions.fetchRegister(email, password, additionalInfo) as any);
    const user = JSON.parse(localStorage.getItem('safeUser') ?? '{}');
    if (user.uid) {
        await dispatch(fetchUserProfile(user.uid) as any);
    }
};