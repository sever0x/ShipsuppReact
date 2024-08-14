import {
    FETCH_CHATS_FAILURE,
    FETCH_CHATS_REQUEST,
    FETCH_CHATS_SUCCESS,
    FETCH_MESSAGES_FAILURE,
    FETCH_MESSAGES_REQUEST,
    FETCH_MESSAGES_SUCCESS,
    NEW_MESSAGE_RECEIVED,
    SEND_MESSAGE_FAILURE,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
    UPDATE_CHAT_REALTIME,
    UPDATE_MESSAGES_REALTIME,
    SET_SELECTED_CHAT_ID
} from '../constants/actionTypes';
import {ChatState} from "pages/chats/types/state/ChatState";
import {Chat} from "pages/chats/types/Chat";

const initialState: ChatState = {
    chats: [],
    messages: {},
    loading: false,
    error: null,
    selectedChatId: null,
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
        case NEW_MESSAGE_RECEIVED:
        case SEND_MESSAGE_SUCCESS:
            const existingMessages = state.messages[action.payload.groupId] || [];
            const newMessage = {
                ...action.payload.message,
                createTimestampUTC: action.payload.message.createTimestampUTC ?? new Date().toISOString()
            };
            const isMessageExists = existingMessages.some(msg => msg.id === newMessage.id);

            if (!isMessageExists) {
                return {
                    ...state,
                    loading: false,
                    messages: {
                        ...state.messages,
                        [action.payload.groupId]: [...existingMessages, newMessage]
                    },
                    chats: state.chats.map(chat => {
                        return chat.id === action.payload.groupId
                            ? {
                                ...chat,
                                lastMessage: {
                                    text: newMessage.text,
                                    date: newMessage.createTimestampGMT
                                }
                            }
                            : chat;
                    })
                };
            }
            return state;
        case UPDATE_CHAT_REALTIME:
            return {
                ...state,
                chats: action.payload.map((chat: Chat) => ({
                    ...chat,
                    unreadCount: chat.unreadCount || {}
                }))
            };
        case UPDATE_MESSAGES_REALTIME:
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [action.payload.groupId]: action.payload.messages
                }
            };
        case SET_SELECTED_CHAT_ID:
            return {
                ...state,
                selectedChatId: action.payload,
                messages: action.payload ? state.messages : {}
            };
        default:
            return state;
    }
};

export default chatReducer;