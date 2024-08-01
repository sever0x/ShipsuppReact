import { Dispatch } from 'redux';
import { ref, get, update } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { database, storage as firebaseStorage } from 'app/config/firebaseConfig';
import {
    FETCH_PROFILE_REQUEST,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAILURE,
    UPDATE_PROFILE_PHOTO_REQUEST,
    UPDATE_PROFILE_PHOTO_SUCCESS,
    UPDATE_PROFILE_PHOTO_FAILURE,
    UPDATE_PROFILE_REQUEST,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILURE
} from '../constants/actionTypes';
import storage from 'misc/storage';
import { v4 as uuidv4 } from 'uuid';
import {calculateRetryDelay, RETRY_CONFIG} from 'app/config/retryConfig';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUserProfile = (uid: string, isNewProfile: boolean = false) => async (dispatch: Dispatch) => {
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

        // Delete old profile photo if it exists
        if (userData.profilePhoto) {
            const oldPhotoRef = storageRef(firebaseStorage, userData.profilePhoto);
            await deleteObject(oldPhotoRef);
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