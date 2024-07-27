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
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    User
} from 'firebase/auth';
import storage from 'misc/storage';
import {auth} from 'app/config/firebaseConfig';
import {ThunkAction} from "redux-thunk";
import {RootState} from "../reducers";
import {UnknownAction} from "redux";

const serializeUser = (user: User | null) => {
    if (!user) return null;
    return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
    };
};

const createSafeUserObject = (user: User) => ({
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    displayName: user.displayName,
});

const requestSignIn = () => ({
    type: REQUEST_SIGN_IN,
});

const successSignIn = (user: User) => {
    const safeUser = createSafeUserObject(user);
    storage.setItem('safeUser', JSON.stringify(safeUser));
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

const fetchGoogleSignIn = (): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> => async (dispatch: any) => {
    dispatch(requestSignIn());
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        storage.setItem('user', JSON.stringify(user));
        dispatch(successSignIn(user));
    } catch (error) {
        dispatch(errorSignIn(error));
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

const fetchRegister = (email: string, password: string) => async (dispatch: any) => {
    dispatch(requestSignUp());
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        dispatch(successSignUp());
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