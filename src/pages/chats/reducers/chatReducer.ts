import {
    FETCH_CHATS_FAILURE,
    FETCH_CHATS_REQUEST,
    FETCH_CHATS_SUCCESS,
    FETCH_MESSAGES_FAILURE,
    FETCH_MESSAGES_REQUEST,
    FETCH_MESSAGES_SUCCESS, NEW_MESSAGE_RECEIVED,
    SEND_MESSAGE_FAILURE,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS, UPDATE_CHAT_REALTIME, UPDATE_MESSAGES_REALTIME
} from '../constants/actionTypes';
import {ChatState} from "pages/chats/types/state/ChatState";

const initialState: ChatState = {
    chats: [],
    messages: {},
    loading: false,
    error: null
};

const chatReducer = (state = initialState, action: any): ChatState => {
    switch (action.type) {
        case FETCH_CHATS_REQUEST:
        case FETCH_MESSAGES_REQUEST:
        case SEND_MESSAGE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_CHATS_SUCCESS:
            return {
                ...state,
                loading: false,
                chats: action.payload
            };
        case FETCH_MESSAGES_SUCCESS:
            return {
                ...state,
                loading: false,
                messages: {
                    ...state.messages,
                    [action.payload.groupId]: action.payload.messages
                }
            };
        case FETCH_CHATS_FAILURE:
        case FETCH_MESSAGES_FAILURE:
        case SEND_MESSAGE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SEND_MESSAGE_SUCCESS:
        case NEW_MESSAGE_RECEIVED:
            return {
                ...state,
                loading: false,
                messages: {
                    ...state.messages,
                    [action.payload.groupId]: [
                        ...(state.messages[action.payload.groupId] || []),
                        action.payload.message
                    ]
                },
                chats: state.chats.map(chat =>
                    chat.id === action.payload.groupId
                        ? {...chat, lastMessage: action.payload.message.text}
                        : chat
                )
            };
        case UPDATE_CHAT_REALTIME:
            return {
                ...state,
                chats: action.payload
            };
        case UPDATE_MESSAGES_REALTIME:
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [action.payload.groupId]: action.payload.messages
                }
            };
        default:
            return state;
    }
};

export default chatReducer;