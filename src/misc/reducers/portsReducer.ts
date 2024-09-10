import {FETCH_PORTS_ERROR, FETCH_PORTS_SUCCESS} from '../constants/actionTypes';

interface PortsState {
    data: any;
    error: string | null;
}

const initialState: PortsState = {
    data: {},
    error: null
};

const portsReducer = (state = initialState, action: any): PortsState => {
    switch (action.type) {
        case FETCH_PORTS_SUCCESS:
            return { ...state, data: action.payload, error: null };
        case FETCH_PORTS_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};

export default portsReducer;