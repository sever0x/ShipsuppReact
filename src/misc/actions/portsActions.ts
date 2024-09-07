import {FETCH_PORTS_ERROR, FETCH_PORTS_SUCCESS} from '../constants/actionTypes';
import {database} from 'app/config/firebaseConfig';
import {ThunkAction} from "redux-thunk";
import {UnknownAction} from "redux";
import {get, ref} from "firebase/database";
import {RootState} from 'app/reducers';

const fetchPorts = (): ThunkAction<Promise<void>, RootState, unknown, UnknownAction> => async (dispatch: any) => {
    try {
        const portsRef = ref(database, '/config/ports');
        const snapshot = await get(portsRef);
        if (snapshot.exists()) {
            const ports = snapshot.val();
            dispatch({ type: FETCH_PORTS_SUCCESS, payload: ports });
        } else {
            dispatch({ type: FETCH_PORTS_ERROR, payload: 'No ports data available' });
        }
    } catch (error) {
        dispatch({ type: FETCH_PORTS_ERROR, payload: error });
    }
};

const exportFunctions = {
    fetchPorts,
};

export default exportFunctions;