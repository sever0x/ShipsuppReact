import {
    createUserWithEmailAndPassword,
    getIdToken,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User
} from 'firebase/auth';
import { get, ref, set } from 'firebase/database';
import { ThunkAction } from 'redux-thunk';
import { UnknownAction } from 'redux';

import { auth, database } from 'app/config/firebaseConfig';
import storage from 'misc/storage';
import logger from 'app/utility/logger';
import { RootState } from '../reducers';
import * as ActionTypes from '../constants/actionTypes';

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
const successSignUp = () => createAction(ActionTypes.SUCCESS_SIGN_UP);
const errorSignUp = (error: any) => createAction(ActionTypes.ERROR_SIGN_UP, error);
const requestSignOut = () => createAction(ActionTypes.REQUEST_SIGN_OUT);
const successSignOut = () => createAction(ActionTypes.SUCCESS_SIGN_OUT);
const authStateChange = (user: User | null) => createAction(ActionTypes.AUTH_STATE_CHANGED, serializeUser(user));

// Thunk actions
const googleProvider = new GoogleAuthProvider();

const fetchGoogleSignIn = (): ThunkAction<Promise<{ isNewUser: boolean, email: string, firstName: string, lastName: string }>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        dispatch(requestSignIn());
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);

            let isNewUser = false;
            let firstName: string;
            let lastName: string;

            if (!snapshot.exists()) {
                isNewUser = true;
                firstName = user.displayName ? user.displayName.split(' ')[0] : '';
                lastName = user.displayName ? user.displayName.split(' ').slice(1).join(' ') : '';

                const userProfile: UserProfile = {
                    id: user.uid,
                    email: user.email,
                    firstName,
                    lastName,
                    accessType: 'GRANTED',
                    date: new Date().toLocaleString(),
                    role: 'SELLER',
                    fcmTokens: [],
                    notifications: {},
                    phone: user.phoneNumber ?? '',
                    profilePhoto: user.photoURL ?? '',
                    portsArray: [],
                    vesselIMO: "",
                    vesselMMSI: ""
                };

                await set(userRef, userProfile);
            } else {
                const hasAccess = await checkUserAccess(user.uid);
                if (hasAccess) {
                    const userData = snapshot.val();
                    firstName = userData.firstName;
                    lastName = userData.lastName;
                } else {
                    await signOut(auth);
                    throw new Error('Access denied. Please contact the administrator for details if you think an error has occurred.');
                }
            }

            dispatch(successSignIn(user));
            return { isNewUser, email: user.email || '', firstName, lastName };
        } catch (error) {
            dispatch(errorSignIn(error));
            return Promise.reject(new Error('Failed to sign in'));
        }
    };

const fetchLogin = (email: string, password: string): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> =>
    async (dispatch) => {
        dispatch(requestSignIn());
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const hasAccess = await checkUserAccess(user.uid);
            if (hasAccess) {
                dispatch(successSignIn(user));
            } else {
                await signOut(auth);
                throw new Error('Access denied. Please contact the administrator for details if you think an error has occurred.');
            }
        } catch (error) {
            dispatch(errorSignIn(error));
        }
    };

const fetchRegister = (email: string, password: string, additionalInfo: Omit<UserProfile, 'id' | 'email' | 'accessType' | 'date' | 'role' | 'fcmTokens' | 'notifications' | 'profilePhoto'>) =>
    async (dispatch: any) => {
        dispatch(requestSignUp());
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userProfile: UserProfile = {
                id: user.uid,
                email: user.email,
                accessType: 'GRANTED',
                date: new Date().toLocaleString(),
                role: 'SELLER',
                fcmTokens: [],
                notifications: {},
                profilePhoto: '',
                ...additionalInfo
            };

            const userRef = ref(database, `users/${user.uid}`);
            await set(userRef, userProfile);

            dispatch(successSignUp());
            dispatch(successSignIn(user));
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
        // Handle error if needed
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
};