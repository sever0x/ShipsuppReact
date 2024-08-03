import {Dispatch} from 'redux';
import {ref, push, serverTimestamp, set, update, get} from 'firebase/database';
import {database} from 'app/config/firebaseConfig';
import {
    FETCH_CHATS_FAILURE,
    FETCH_CHATS_REQUEST,
    FETCH_CHATS_SUCCESS,
    FETCH_MESSAGES_FAILURE,
    FETCH_MESSAGES_REQUEST,
    FETCH_MESSAGES_SUCCESS,
    SEND_MESSAGE_FAILURE,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS
} from '../constants/actionTypes';
import { Message } from '../types/Message';

export const fetchChats = (sellerId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_CHATS_REQUEST });

    try {
        const groupsRef = ref(database, 'chat/groups');
        const snapshot = await get(groupsRef);

        if (snapshot.exists()) {
            const groups = snapshot.val();
            const sellerGroups = Object.values(groups).filter((group: any) => {
                return group?.membersData[sellerId];
            });

            dispatch({
                type: FETCH_CHATS_SUCCESS,
                payload: sellerGroups
            });
        } else {
            dispatch({
                type: FETCH_CHATS_SUCCESS,
                payload: []
            });
        }
    } catch (error) {
        dispatch({
            type: FETCH_CHATS_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const fetchMessages = (groupId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_MESSAGES_REQUEST });

    try {
        const messagesRef = ref(database, `chat/messages/${groupId}`);
        const snapshot = await get(messagesRef);

        if (snapshot.exists()) {
            const messages = snapshot.val();
            const messageList = Object.values(messages).sort((a: any, b: any) =>
                new Date(a.createTimestampGMT).getTime() - new Date(b.createTimestampGMT).getTime()
            );

            dispatch({
                type: FETCH_MESSAGES_SUCCESS,
                payload: { groupId, messages: messageList }
            });
        } else {
            dispatch({
                type: FETCH_MESSAGES_SUCCESS,
                payload: { groupId, messages: [] }
            });
        }
    } catch (error) {
        dispatch({
            type: FETCH_MESSAGES_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const sendMessage = (groupId: string, senderId: string, text: string) => async (dispatch: Dispatch) => {
    dispatch({ type: SEND_MESSAGE_REQUEST });

    try {
        const messagesRef = ref(database, `chat/messages/${groupId}`);
        const newMessageRef = push(messagesRef);
        const localTimestamp = new Date().toISOString();
        const newMessage: Message = {
            id: newMessageRef.key || '',
            createTimestampGMT: null,
            localTimestamp,
            groupId,
            senderId,
            status: 'SENT',
            text,
            title: ''
        };

        await set(newMessageRef, newMessage);

        dispatch({
            type: SEND_MESSAGE_SUCCESS,
            payload: { groupId, message: newMessage }
        });

        const groupRef = ref(database, `chat/groups/${groupId}`);
        await update(groupRef, { lastMessage: text });

    } catch (error) {
        dispatch({
            type: SEND_MESSAGE_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};