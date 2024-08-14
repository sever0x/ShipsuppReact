import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app/reducers';
import {
    fetchChats,
    fetchMessages, markMessagesAsRead, resetUnreadCount,
    sendMessage, setSelectedChatId,
    setupMessageListener,
    setupRealtimeListeners
} from "../actions/chatActions";
import ChatList from '../components/ChatList';
import ChatContent from '../components/ChatContent';
import Box from 'components/Box';
import { createSelector } from 'reselect';

const selectChat = (state: RootState) => state.chat;
const selectSelectedChatId = (state: RootState) => state.chat.selectedChatId;

const selectCurrentChatMessages = createSelector(
    [selectChat, selectSelectedChatId],
    (chat, selectedChatId) => selectedChatId ? chat.messages[selectedChatId] || [] : []
);

const selectCurrentChatMembersData = createSelector(
    [selectChat, selectSelectedChatId],
    (chat, selectedChatId) => {
        const selectedChat = chat.chats.find(c => c.id === selectedChatId);
        return selectedChat ? selectedChat.membersData : {};
    }
);

const Chats: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.userAuth.user);
    const { chats, loading, selectedChatId } = useSelector((state: RootState) => state.chat);

    const currentChatMessages = useSelector((state: RootState) =>
        selectCurrentChatMessages(state)
    );
    const currentChatMembersData = useSelector((state: RootState) =>
        selectCurrentChatMembersData(state)
    );

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchChats(user.uid) as any);
            const unsubscribe = dispatch(setupRealtimeListeners(user.uid) as any);
            return () => unsubscribe();
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (selectedChatId && user?.uid) {
            dispatch(fetchMessages(selectedChatId) as any);
            const unsubscribe = dispatch(setupMessageListener(selectedChatId, user.uid) as any);
            return () => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            };
        }
    }, [dispatch, selectedChatId, user]);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchChats(user.uid) as any);
        }
    }, [dispatch, user]);

    const handleChatSelect = useCallback((chatId: string) => {
        dispatch(setSelectedChatId(chatId));
        dispatch(fetchMessages(chatId) as any);
        // if (user?.uid) {
        //     dispatch(markMessagesAsRead(chatId, user.uid) as any);
        // }
    }, [dispatch, user]);

    const handleSendMessage = useCallback((text: string) => {
        if (selectedChatId && user?.uid) {
            dispatch(sendMessage(selectedChatId, user.uid, text) as any);
            dispatch(resetUnreadCount(selectedChatId, user.uid) as any);
        }
    }, [dispatch, selectedChatId, user]);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            dispatch(setSelectedChatId(null));
        }
    }, [dispatch]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleKeyDown]);

    return (
        <Box sx={{
            display: 'flex',
            height: '80vh',
            overflow: 'hidden'
        }}>
            <Box sx={{
                width: '340px',
                borderRight: '1px solid #e0e0e0',
                overflowY: 'auto',
                height: '100%'
            }}>
                <ChatList
                    chats={chats}
                    onSelectChat={handleChatSelect}
                    selectedChatId={selectedChatId}
                    loading={loading}
                    currentUserId={user?.uid ?? ''}
                />
            </Box>
            <Box sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
            }}>
                <ChatContent
                    messages={currentChatMessages}
                    membersData={currentChatMembersData}
                    currentUserId={user?.uid || ''}
                    onSendMessage={handleSendMessage}
                    loading={loading && currentChatMessages.length === 0}
                    // selectedChatId={selectedChatId}
                />
            </Box>
        </Box>
    );
};

export default Chats;