import {Dispatch} from 'redux';
import {get, ref, update} from 'firebase/database';
import {deleteObject, getDownloadURL, getMetadata, ref as storageRef, uploadBytes} from 'firebase/storage';
import {database, storage as firebaseStorage, auth} from 'app/config/firebaseConfig';
import {
    ADD_PORT_FAILURE,
    ADD_PORT_REQUEST,
    ADD_PORT_SUCCESS,
    CHANGE_PASSWORD_FAILURE,
    CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS,
    FETCH_PROFILE_FAILURE,
    FETCH_PROFILE_REQUEST,
    FETCH_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE,
    UPDATE_PROFILE_PHOTO_FAILURE,
    UPDATE_PROFILE_PHOTO_REQUEST,
    UPDATE_PROFILE_PHOTO_SUCCESS,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS
} from '../constants/actionTypes';
import storage from 'misc/storage';
import {v4 as uuidv4} from 'uuid';
import {calculateRetryDelay, RETRY_CONFIG} from 'app/config/retryConfig';
import axios from 'axios';
import { BACKEND_SERVICE } from 'constants/api';
import {getIdToken} from "firebase/auth";
import {AppDispatch} from "../../../misc/hooks/useAppDispatch";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ChangePasswordData {
    userId: string;
    newPassword: string;
    confirmPassword: string;
}

interface ChangePasswordResponse {
    success: boolean;
    error?: string;
}

export const changePassword = (data: ChangePasswordData): any => {
    return async (dispatch: any): Promise<ChangePasswordResponse> => {
        dispatch({ type: CHANGE_PASSWORD_REQUEST });

        try {
            const user = auth.currentUser;
            if (!user) {
                dispatch({
                    type: CHANGE_PASSWORD_FAILURE,
                    payload: 'No authenticated user found'
                });
                return { success: false, error: 'No authenticated user found' };
            }

            const idToken = await user.getIdToken();

            await axios.post(`${BACKEND_SERVICE}/changePassword`, {
                userId: data.userId,
                newPassword: data.newPassword,
                confirmPassword: data.confirmPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${idToken}`
                }
            });

            dispatch({ type: CHANGE_PASSWORD_SUCCESS });
            return { success: true };
        } catch (error) {
            let errorMessage = 'Failed to change password';

            if (axios.isAxiosError(error)) {
                if (error.response?.status === 401) {
                    errorMessage = 'Session expired. Please login again.';
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            dispatch({
                type: CHANGE_PASSWORD_FAILURE,
                payload: errorMessage
            });

            return { success: false, error: errorMessage };
        }
    };
};

export const fetchUserProfile = (uid: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_PROFILE_REQUEST });

    let retryCount = 0;

    const fetchProfile = async (): Promise<any> => {
        try {
            const userRef = ref(database, `users/${uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                return snapshot.val();
            } else if (retryCount < RETRY_CONFIG.maxRetries) {
                console.log(`Profile not found, retrying... (Attempt ${retryCount + 1}/${RETRY_CONFIG.maxRetries})`);
                retryCount++;
                const retryDelay = calculateRetryDelay(retryCount);
                await delay(retryDelay);
                return fetchProfile();
            } else {
                throw new Error('User profile not found');
            }
        } catch (error) {
            throw error;
        }
    };

    try {
        const userData = await fetchProfile();
        storage.setItem(storage.keys.USER_DATA, userData);
        dispatch({
            type: FETCH_PROFILE_SUCCESS,
            payload: userData
        });
    } catch (error) {
        dispatch({
            type: FETCH_PROFILE_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const updateProfilePhoto = (uid: string, file: File) => async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_PROFILE_PHOTO_REQUEST });

    try {
        // Get current user data
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            throw new Error('User profile not found');
        }

        const userData = snapshot.val();

        // Check if the current profile photo is in Firebase Storage
        if (userData.profilePhoto?.startsWith('https://firebasestorage.googleapis.com')) {
            try {
                const oldPhotoRef = storageRef(firebaseStorage, userData.profilePhoto);
                await getMetadata(oldPhotoRef); // This will throw an error if the file doesn't exist
                await deleteObject(oldPhotoRef);
            } catch (error) {
                console.log('Previous profile photo not found in Storage or error deleting:', error);
                // Continue with uploading new photo even if deleting old one fails
            }
        }

        // Upload new profile photo
        const uniqueFileName = `${uuidv4()}_${file.name.replace(/[.#$\/\[\]]/g, '_')}`;
        const photoRef = storageRef(firebaseStorage, `users/${uid}/profilePhoto/${uniqueFileName}`);
        await uploadBytes(photoRef, file);
        const photoURL = await getDownloadURL(photoRef);

        // Update user profile with new photo URL
        await update(userRef, { profilePhoto: photoURL });

        dispatch({
            type: UPDATE_PROFILE_PHOTO_SUCCESS,
            payload: { profilePhoto: photoURL }
        });

        return photoURL;
    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_PHOTO_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
        throw error;
    }
};

export const updateProfile = (uid: string, profileData: any) => async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST });

    try {
        const userRef = ref(database, `users/${uid}`);
        await update(userRef, profileData);

        storage.setItem(storage.keys.USER_DATA, profileData);

        dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: profileData
        });
    } catch (error) {
        dispatch({
            type: UPDATE_PROFILE_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const addNewPort = (userId: string, portId: string, portsToCopy?: string[]) => async (dispatch: AppDispatch) => {
    dispatch({ type: ADD_PORT_REQUEST });

    try {
        const user = auth.currentUser;
        if (!user) {
            throw new Error('No authenticated user found');
        }

        const idToken = await getIdToken(user);

        const response = await axios.put(
            `${BACKEND_SERVICE}/addNewPort`,
            {
                userId,
                portId,
                portsToCopy: portsToCopy || []
            },
            {
                headers: {
                    'Authorization': `Bearer ${idToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        dispatch({
            type: ADD_PORT_SUCCESS,
            payload: response.data
        });

        dispatch(fetchUserProfile(userId));

        return response.data;
    } catch (error) {
        let errorMessage = 'Failed to add port';

        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                errorMessage = 'Session expired. Please login again.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
        } else if (error instanceof Error) {
            errorMessage = error.message;
        }

        dispatch({
            type: ADD_PORT_FAILURE,
            payload: errorMessage
        });

        throw error;
    }
};