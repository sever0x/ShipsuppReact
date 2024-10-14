import {Dispatch} from 'redux';
import {get, off, onChildAdded, onValue, push, ref, serverTimestamp, set, update} from 'firebase/database';
import {database} from 'app/config/firebaseConfig';
import {
    FETCH_CHATS_FAILURE,
    FETCH_CHATS_REQUEST,
    FETCH_CHATS_SUCCESS,
    FETCH_MESSAGES_FAILURE,
    FETCH_MESSAGES_REQUEST,
    FETCH_MESSAGES_SUCCESS,
    MARK_MESSAGES_AS_READ,
    NEW_MESSAGE_RECEIVED,
    OPEN_CHAT_FROM_ORDERS_OR_CREATE_NEW_CHAT_FAILURE,
    OPEN_CHAT_FROM_ORDERS_OR_CREATE_NEW_CHAT_SUCCESS,
    RESET_SELECTED_CHAT_ID,
    SEND_MESSAGE_FAILURE,
    SEND_MESSAGE_REQUEST,
    SEND_MESSAGE_SUCCESS,
    SET_SELECTED_CHAT_ID,
    UPDATE_CHAT_REALTIME
} from '../constants/actionTypes';
import {debounce} from "@mui/material";
import {Order} from "pages/orders/types/Order";
import {Chat} from "pages/chats/types/Chat";
import {RootState} from "../../../app/reducers";

let lastReceivedMessageId = '';

const debouncedDispatchNewMessage = debounce((dispatch, payload) => {
    if (payload.message.id !== lastReceivedMessageId) {
        lastReceivedMessageId = payload.message.id;
        dispatch({
            type: NEW_MESSAGE_RECEIVED,
            payload
        });
    }
}, 100);

export const setSelectedChatId = (chatId: string | null) => ({
    type: SET_SELECTED_CHAT_ID,
    payload: chatId
});

export const resetSelectedChatId = () => ({
    type: RESET_SELECTED_CHAT_ID
});

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
            const messageList = Object.values(messages)
                .sort((a: any, b: any) =>
                    new Date(a.createTimestampGMT).getTime() - new Date(b.createTimestampGMT).getTime()
                )
                .filter((message: any, index: number, self: any[]) =>
                    index === self.findIndex((m: any) => m.id === message.id)
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
        const newMessage = {
            id: newMessageRef.key ?? '',
            createTimestampGMT: new Date().toISOString(),
            groupId,
            senderId,
            status: 'SENT',
            text,
            title: ''
        };

        await set(newMessageRef, newMessage);

        const groupRef = ref(database, `chat/groups/${groupId}`);
        await update(groupRef, {
            lastMessage: {
                text
            }
        });

        dispatch({
            type: SEND_MESSAGE_SUCCESS,
            payload: { groupId, message: newMessage }
        });

    } catch (error) {
        dispatch({
            type: SEND_MESSAGE_FAILURE,
            payload: error instanceof Error ? error.message : 'An unknown error occurred'
        });
    }
};

export const setupRealtimeListeners = (userId: string) => (dispatch: Dispatch) => {
    const chatsRef = ref(database, 'chat/groups');

    const onChange = (snapshot: { exists: () => any; val: () => any; }) => {
        if (snapshot.exists()) {
            const chats = snapshot.val();
            const userChats = Object.values(chats).filter((chat: any) => chat.membersData[userId]);

            dispatch({
                type: UPDATE_CHAT_REALTIME,
                payload: userChats
            });
        }
    };

    onValue(chatsRef, onChange);

    return () => off(chatsRef, 'value', onChange);
};


export const setupMessageListener = (groupId: string, currentUserId: string) => (dispatch: Dispatch) => {
    const messagesRef = ref(database, `chat/messages/${groupId}`);

    const newMessageHandler = onChildAdded(messagesRef, (snapshot) => {
        const newMessage = snapshot.val();
        if (newMessage.createTimestampGMT) {
            // fixme -3 hours from createTimestampGMT, see log newMessage
            const date = new Date(newMessage.createTimestampGMT);
            date.setHours(date.getHours() - 3);
            newMessage.createTimestampGMT = date.toISOString();
        }
        if (newMessage.senderId !== currentUserId) {
            debouncedDispatchNewMessage(dispatch, { groupId, message: newMessage });
        }
    });

    return () => {
        off(messagesRef, 'child_added', newMessageHandler);
        debouncedDispatchNewMessage.clear();
    };
};

export const markMessagesAsRead = (chatId: string, userId: string) => async (dispatch: Dispatch) => {
    try {
        const chatRef = ref(database, `chat/groups/${chatId}/unreadCount/${userId}`);
        await set(chatRef, 0);

        dispatch({
            type: MARK_MESSAGES_AS_READ,
            payload: { chatId, userId }
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
    }
};

export const watchAndResetUnreadCount = (chatId: string, userId: string) => (dispatch: Dispatch, getState: () => RootState) => {
    const unreadCountRef = ref(database, `chat/groups/${chatId}/unreadCount/${userId}`);

    const unreadCountListener = onValue(unreadCountRef, (snapshot) => {
        const unreadCount = snapshot.val();
        const state = getState();
        const isActiveChat = state.chat.selectedChatId === chatId;

        if (unreadCount > 0 && isActiveChat) {
            dispatch(resetUnreadCount(chatId, userId) as any);
        }
    });

    return () => {
        off(unreadCountRef, 'value', unreadCountListener);
    };
};

export const updateUnreadCount = (chatId: string, userId: string, count: number) => async (dispatch: Dispatch) => {
    try {
        const chatRef = ref(database, `chat/groups/${chatId}/unreadCount/${userId}`);
        await set(chatRef, count);
    } catch (error) {
        console.error("Error updating unread count:", error);
    }
};

export const resetUnreadCount = (chatId: string, userId: string) => async (dispatch: Dispatch) => {
    try {
        const chatRef = ref(database, `chat/groups/${chatId}/unreadCount/${userId}`);
        await set(chatRef, 0);
    } catch (error) {
        console.error("Error resetting unread count:", error);
    }
};

export const switchToChatOrCreateNew = (order: Order, sellerId: string) => async (dispatch: Dispatch) => {
    try {
        const chatsRef = ref(database, 'chat/groups');
        const snapshot = await get(chatsRef);

        let existChat: Chat | null = null;

        if (snapshot.exists()) {
            const chats = snapshot.val();
            existChat = findExistChat(chats, order.buyer.id, sellerId);
        }

        if (existChat) {
            dispatch({ type: SET_SELECTED_CHAT_ID, payload: existChat.id });
        } else {
            const newChatRef = push(ref(database, 'chat/groups'));
            const newChat = {
                id: newChatRef.key,
                [`_${order.buyer.id}`]: order.buyer.id,
                [`_${sellerId}`]: sellerId,
                lastMessage: {
                    date: new Date().toISOString(),
                    text: "Chat created",
                },
                membersData: {
                    [order.buyer.id]: {
                        firstName: order.buyer.firstName,
                        id: order.buyer.id,
                        lastName: order.buyer.lastName,
                        photoUrl: order.buyer.profilePhoto,
                        role: order.buyer.role
                    },
                    [sellerId]: {
                        firstName: order.seller.firstName,
                        id: sellerId,
                        lastName: order.seller.lastName,
                        photoUrl: order.seller.profilePhoto,
                        role: order.seller.role
                    },
                },
                title: `${order.seller.firstName} ${order.seller.lastName} in ${order.port.title}`,
                unreadCount: {
                    [order.buyer.id]: 0,
                    [sellerId]: 0
                }
            };

            await set(newChatRef, newChat);
            dispatch({type: OPEN_CHAT_FROM_ORDERS_OR_CREATE_NEW_CHAT_SUCCESS, payload: newChat});
        }
    } catch (error) {
        console.error("Error creating or opening chat:", error);
        dispatch({ type: OPEN_CHAT_FROM_ORDERS_OR_CREATE_NEW_CHAT_FAILURE, payload: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
}

const findExistChat = (chats: any, buyerId: string, sellerId: string): Chat => {
    return <Chat>Object.values(chats).find((chat: any) =>
        chat[`_${buyerId}`] === buyerId && chat[`_${sellerId}`] === sellerId
    );
}