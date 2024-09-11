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
import {
    createUserWithEmailAndPassword,
    getIdToken,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User
} from 'firebase/auth';
import storage from 'misc/storage';
import {auth, database} from 'app/config/firebaseConfig';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {UnknownAction} from "redux";
import {get, ref, set} from "firebase/database";
import logger from 'app/utility/logger';

const serializeUser = (user: User | null) => {
    if (!user) return null;
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
    };
};

const requestSignIn = () => ({
    type: REQUEST_SIGN_IN,
});

const successSignIn = (user: User) => {
    const safeUser = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
    };

    storage.setItem('safeUser', JSON.stringify(safeUser));

    try {
        logger.info(`User signed in: ${safeUser.email}`);
        getIdToken(user).then((token) => {
            logger.info(`JWT Token: ${token}`);
        });
    } catch (error) {
        logger.error('Error getting JWT token:', error);
    }

    return {
        type: SUCCESS_SIGN_IN,
        payload: safeUser,
    };
};

const errorSignIn = (error: any) => ({
    type: ERROR_SIGN_IN,
    payload: error,
});

const requestSignUp = () => ({
    type: REQUEST_SIGN_UP,
});

const successSignUp = () => ({
    type: SUCCESS_SIGN_UP,
});

const errorSignUp = (error: any) => ({
    type: ERROR_SIGN_UP,
    payload: error,
});

const requestSignOut = () => ({
    type: REQUEST_SIGN_OUT,
});

const successSignOut = () => ({
    type: SUCCESS_SIGN_OUT,
});

const authStateChange = (user: User | null) => ({
    type: AUTH_STATE_CHANGED,
    payload: serializeUser(user),
});

const googleProvider = new GoogleAuthProvider();

const fetchGoogleSignIn = (): ThunkAction<Promise<{ isNewUser: boolean, email: string, firstName: string, lastName: string }>, RootState, unknown, UnknownAction> => async (dispatch: any) => {
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

            const userProfile = {
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
            const userData = snapshot.val();
            firstName = userData.firstName;
            lastName = userData.lastName;
        }

        dispatch(successSignIn(user));
        return { isNewUser, email: user.email || '', firstName, lastName };
    } catch (error) {
        dispatch(errorSignIn(error));
        throw error;
    }
};

const fetchLogin = (email: string, password: string) => async (dispatch: any) => {
    dispatch(requestSignIn());
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        dispatch(successSignIn(user));
    } catch (error) {
        dispatch(errorSignIn(error));
    }
};

const fetchRegister = (email: string, password: string, additionalInfo: {
    firstName: string,
    lastName: string,
    phone: string,
    vesselIMO: string,
    vesselMMSI: string,
    portsArray: Array<{
        city: {
            country: {
                id: string,
                phoneCode: string,
                title: string
            },
            id: string,
            title: string
        },
        id: string,
        title: string
    }>
}) => async (dispatch: any) => {
    dispatch(requestSignUp());
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userProfile = {
            id: user.uid,
            email: user.email,
            firstName: additionalInfo.firstName,
            lastName: additionalInfo.lastName,
            accessType: 'GRANTED',
            date: new Date().toLocaleString(),
            role: 'SELLER',
            fcmTokens: [],
            notifications: {},
            phone: additionalInfo.phone,
            profilePhoto: '',
            vesselIMO: additionalInfo.vesselIMO,
            vesselMMSI: additionalInfo.vesselMMSI,
            portsArray: additionalInfo.portsArray,
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
    }
};

const exportFunctions = {
    fetchLogin,
    fetchRegister,
    fetchLogout,
    fetchGoogleSignIn,
    successSignIn,
    requestSignOut,
    authStateChange,
};

export default exportFunctions;