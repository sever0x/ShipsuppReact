import {
    getIdToken,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User
} from 'firebase/auth';
import {get, ref} from 'firebase/database';
import {ThunkAction} from 'redux-thunk';
import {UnknownAction} from 'redux';

import {auth, database} from 'app/config/firebaseConfig';
import storage from 'misc/storage';
import logger from 'app/utility/logger';
import {RootState} from '../reducers';
import * as ActionTypes from '../constants/actionTypes';
import {BACKEND_SERVICE} from "../../constants/api";

// Type definitions
type SafeUser = {
    uid: string;
    email: string | null;
    emailVerified: boolean;
    displayName: string | null;
};

type UserProfile = {
    id: string;
    email: string | null;
    firstName: string;
    lastName: string;
    accessType: string;
    date: string;
    role: string;
    fcmTokens: any[];
    notifications: Record<string, any>;
    phone: string;
    profilePhoto: string;
    vesselIMO: string;
    vesselMMSI: string;
    portsArray: Array<{
        city: {
            country: {
                id: string;
                phoneCode: string;
                title: string;
            };
            id: string;
            title: string;
        };
        id: string;
        title: string;
    }>;
    referral: string;
};

// Helper functions
const serializeUser = (user: User | null) => {
    if (!user) return null;
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
    };
};

const checkUserAccess = async (uid: string): Promise<boolean> => {
    const userRef = ref(database, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData.role === 'SELLER' && userData.accessType === 'GRANTED';
    }
    return false;
};

const submitPartnerApplication = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    phone?: string;
    portId?: string;
    referralCode?: string;
}) => {
    const response = await fetch(`${BACKEND_SERVICE}/postPartnerApplication`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(userData).toString()
    });

    if (!response.ok) {
        throw new Error('Failed to submit partner application');
    }
};

// Action creators
const createAction = <T extends string, P>(type: T, payload?: P) => ({ type, payload });

const requestSignIn = () => createAction(ActionTypes.REQUEST_SIGN_IN);
const successSignIn = (user: User) => {
    const safeUser: SafeUser = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
    };

    storage.setItem('safeUser', JSON.stringify(safeUser));

    logger.info(`User signed in: ${safeUser.email}`);
    getIdToken(user).then((token) => logger.info(`JWT Token: ${token}`)).catch((error) => logger.error('Error getting JWT token:', error));

    return createAction(ActionTypes.SUCCESS_SIGN_IN, safeUser);
};
const errorSignIn = (error: any) => createAction(ActionTypes.ERROR_SIGN_IN, error);
const requestSignUp = () => createAction(ActionTypes.REQUEST_SIGN_UP);
const errorSignUp = (error: any) => createAction(ActionTypes.ERROR_SIGN_UP, error);
const requestSignOut = () => createAction(ActionTypes.REQUEST_SIGN_OUT);
const successSignOut = () => createAction(ActionTypes.SUCCESS_SIGN_OUT);
const authStateChange = (user: User | null) => createAction(ActionTypes.AUTH_STATE_CHANGED, serializeUser(user));
const requestPasswordReset = () => createAction(ActionTypes.REQUEST_PASSWORD_RESET);
const successPasswordReset = () => createAction(ActionTypes.SUCCESS_PASSWORD_RESET);
const errorPasswordReset = (error: any) => createAction(ActionTypes.ERROR_PASSWORD_RESET, error);

// Thunk actions
const googleProvider = new GoogleAuthProvider();

const fetchPasswordReset = (email: string): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        dispatch(requestPasswordReset());
        try {
            const response = await fetch(`${BACKEND_SERVICE}/resetPassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ email }).toString()
            });

            if (!response.ok) {
                throw new Error('Failed to send password reset email');
            }

            dispatch(successPasswordReset());
        } catch (error: any) {
            let errorMessage = 'Failed to send password reset email. Please try again.';

            if (error.message) {
                errorMessage = error.message;
            }

            dispatch(errorPasswordReset(errorMessage));
            throw new Error(errorMessage);
        }
    };

const fetchGoogleSignIn = (): ThunkAction<Promise<{ email: string, firstName: string, lastName: string }>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        dispatch(requestSignIn());
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();
                dispatch(successSignIn(user));
                return {
                    email: user.email || '',
                    firstName: userData.firstName,
                    lastName: userData.lastName
                };
            } else {
                await signOut(auth);
                await user.delete();
                const error = new Error('User does not exist. Please contact support.');
                dispatch(errorSignIn(error));
                throw error;
            }
        } catch (error: any) {
            let errorMessage = error.message || 'Failed to sign in with Google';
            dispatch(errorSignIn(errorMessage));
            throw new Error(errorMessage);
        }
    };

const fetchLogin = (email: string, password: string): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        dispatch(requestSignIn());
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const hasAccess = await checkUserAccess(user.uid);
            if (!hasAccess) {
                await signOut(auth);
                throw new Error('Access denied. Please contact the administrator.');
            }

            dispatch(successSignIn(user));
        } catch (error: any) {
            let errorMessage = 'An error occurred during sign in.';

            if (error.code === 'auth/user-not-found') {
                errorMessage = 'User does not exist. Please contact support.';
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password. Please try again.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            dispatch(errorSignIn(errorMessage));
            throw new Error(errorMessage);
        }
    };

const fetchRegister = (email: string, password: string, additionalInfo: Omit<UserProfile, 'id' | 'email' | 'accessType' | 'date' | 'role' | 'fcmTokens' | 'notifications' | 'profilePhoto'>) =>
    async (dispatch: any) => {
        dispatch(requestSignUp());
        try {
            await submitPartnerApplication({
                firstName: additionalInfo.firstName,
                lastName: additionalInfo.lastName,
                email: email ?? '',
                country: additionalInfo.portsArray[0].city.country.title || '',
                phone: additionalInfo.phone,
                portId: additionalInfo.portsArray?.[0]?.id,
                referralCode: additionalInfo.referral
            });
        } catch (error) {
            dispatch(errorSignUp(error));
        }
    };

const fetchLogout = () => async (dispatch: any) => {
    dispatch(requestSignOut());
    try {
        await signOut(auth);
        storage.removeItem('safeUser');
        storage.removeItem(storage.keys.USER_DATA);
        dispatch(successSignOut());
    } catch (error) {
        logger.error('Error during logout:', error);
    }
};

export default {
    fetchLogin,
    fetchRegister,
    fetchLogout,
    fetchGoogleSignIn,
    successSignIn,
    requestSignOut,
    authStateChange,
    fetchPasswordReset,
};