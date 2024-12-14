import {
    FETCH_SUBSCRIPTIONS_REQUEST,
    FETCH_SUBSCRIPTIONS_SUCCESS,
    FETCH_SUBSCRIPTIONS_FAILURE,
    UPDATE_SUBSCRIPTION_STATUS_REQUEST,
    UPDATE_SUBSCRIPTION_STATUS_SUCCESS,
    UPDATE_SUBSCRIPTION_STATUS_FAILURE
} from '../constants/actionTypes';
import { PortSubscription } from '../types/PortSubscription';

interface PortSubscriptionState {
    loading: boolean;
    data: { [key: string]: PortSubscription };
    error: string | null;
    updatingStatus: boolean;
}

const initialState: PortSubscriptionState = {
    loading: false,
    data: {},
    error: null,
    updatingStatus: false
};

const portSubscription = (state = initialState, action: any): PortSubscriptionState => {
    switch (action.type) {
        case FETCH_SUBSCRIPTIONS_REQUEST:
            return { ...state, loading: true, error: null };

        case FETCH_SUBSCRIPTIONS_SUCCESS:
            const subscriptions = action.payload.data || [];
            const subscriptionData = subscriptions.reduce((acc: { [key: string]: PortSubscription }, subscription: PortSubscription) => {
                acc[subscription.portId] = subscription;
                return acc;
            }, {});

            return {
                ...state,
                loading: false,
                data: subscriptionData,
                error: action.payload.error || null
            };

        case FETCH_SUBSCRIPTIONS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case UPDATE_SUBSCRIPTION_STATUS_REQUEST:
            return { ...state, updatingStatus: true, error: null };

        case UPDATE_SUBSCRIPTION_STATUS_SUCCESS:
            const updatedSubscription = action.payload.data;
            return {
                ...state,
                updatingStatus: false,
                error: null,
                data: updatedSubscription ? {
                    ...state.data,
                    [updatedSubscription.portId]: updatedSubscription
                } : state.data
            };

        case UPDATE_SUBSCRIPTION_STATUS_FAILURE:
            return { ...state, updatingStatus: false, error: action.payload };

        default:
            return state;
    }
};

export default portSubscription;