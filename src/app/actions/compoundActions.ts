import { ThunkAction } from 'redux-thunk';
import { RootState } from '../reducers';
import { UnknownAction } from 'redux';
import actions from "../../app/actions/userAuth";
import { fetchUserProfile } from "pages/profile/actions/profileActions";

export const signInAndLoadProfile = (email: string, password: string): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        await dispatch(actions.fetchLogin(email, password) as any);
        const user = JSON.parse(localStorage.getItem('safeUser') ?? '{}');
        if (user.uid) {
            await dispatch(fetchUserProfile(user.uid) as any);
        }
    };

export const googleSignInAndLoadProfile = (): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        await dispatch(actions.fetchGoogleSignIn());
        const user = JSON.parse(localStorage.getItem('safeUser') ?? '{}');
        if (user.uid) {
            await dispatch(fetchUserProfile(user.uid) as any);
        }
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
        portsArray: any[]
    }
): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        await dispatch(actions.fetchRegister(email, password, additionalInfo) as any);
        const user = JSON.parse(localStorage.getItem('safeUser') ?? '{}');
        if (user.uid) {
            await dispatch(fetchUserProfile(user.uid) as any);
        }
    };