import { Dispatch } from 'redux';
import { ref, get } from 'firebase/database';
import { database } from 'app/config/firebaseConfig';
import { FETCH_PROFILE_REQUEST, FETCH_PROFILE_SUCCESS, FETCH_PROFILE_FAILURE } from '../constants/actionTypes';

export const fetchUserProfile = (uid: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_PROFILE_REQUEST });

    try {
        const userRef = ref(database, `users/${uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
            dispatch({
                type: FETCH_PROFILE_SUCCESS,
                payload: snapshot.val()
            });
        } else {
            throw new Error('User profile not found');
        }
    } catch (error) {
        dispatch({
            type: FETCH_PROFILE_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};