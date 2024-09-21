import {
    FETCH_CHATS_FAILURE,
    FETCH_CHATS_REQUEST,
    FETCH_CHATS_SUCCESS,
    FETCH_MESSAGES_FAILURE,
    FETCH_MESSAGES_REQUEST,
    FETCH_MESSAGES_SUCCESS,
    MARK_MESSAGES_AS_READ,
    NEW_MESSAGE_RECEIVED,
    RESET_SELECTED_CHAT_ID,
    SEND_MESSAGE_FAILURE,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
    SET_SELECTED_CHAT_ID,
    UPDATE_CHAT_REALTIME,
    UPDATE_MESSAGES_REALTIME
} from '../constants/actionTypes';
import {ChatState} from "pages/chats/types/state/ChatState";
import {Chat} from "pages/chats/types/Chat";
import {DEV_MODE} from "../../../constants/config";

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
                const updatedChats = state.chats.map(chat => {
                    if (chat.id === action.payload.groupId) {
                        return {
                            ...chat,
                            lastMessage: {
                                text: newMessage.text,
                                date: newMessage.createTimestampGMT
                            }
                        };
                    }
                    return chat;
                });

                const sortedChats = updatedChats.sort((a, b) => {
                    const dateA = a.lastMessage?.date ? new Date(a.lastMessage.date).getTime() : 0;
                    const dateB = b.lastMessage?.date ? new Date(b.lastMessage.date).getTime() : 0;
                    return dateB - dateA;
                });

                return {
                    ...state,
                    loading: false,
                    messages: {
                        ...state.messages,
                        [action.payload.groupId]: [...existingMessages, newMessage]
                    },
                    chats: sortedChats
                };
            }
            return state;
        case UPDATE_CHAT_REALTIME:
            const updatedChats = action.payload.map((chat: Chat) => ({
                ...chat,
                unreadCount: chat.unreadCount || {}
            }));

            const sortedChats = updatedChats.sort((a: any, b: any) => {
                const dateA = a.lastMessage?.date ? new Date(a.lastMessage.date).getTime() : 0;
                const dateB = b.lastMessage?.date ? new Date(b.lastMessage.date).getTime() : 0;
                return dateB - dateA;
            });

            return {
                ...state,
                chats: sortedChats
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
            if (DEV_MODE) {
                console.log('chatReducer.ts: SET_SELECTED_CHAT_ID', action.payload);
            }
            return {
                ...state,
                selectedChatId: action.payload || state.selectedChatId,
                messages: action.payload ? state.messages : {}
            };
        case MARK_MESSAGES_AS_READ:
            return {
                ...state,
                chats: state.chats.map(chat =>
                    chat.id === action.payload.chatId
                        ? { ...chat, unreadCount: { ...chat.unreadCount, [action.payload.userId]: 0 } }
                        : chat
                )
            };
        case RESET_SELECTED_CHAT_ID:
            return {
                ...state,
                selectedChatId: null
            };
        default:
            return state;
    }
};

export default chatReducer;