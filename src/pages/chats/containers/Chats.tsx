import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'app/reducers';
import { fetchChats, fetchMessages, sendMessage } from "../actions/chatActions";
import ChatList from '../components/ChatList';
import ChatContent from '../components/ChatContent';
import Box from 'components/Box';
import { createSelector } from 'reselect';

const selectChat = (state: RootState) => state.chat;
const selectSelectedChatId = (_: RootState, selectedChatId: string | null) => selectedChatId;

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
    const { chats, loading } = useSelector((state: RootState) => state.chat);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    const currentChatMessages = useSelector((state: RootState) =>
        selectCurrentChatMessages(state, selectedChatId)
    );
    const currentChatMembersData = useSelector((state: RootState) =>
        selectCurrentChatMembersData(state, selectedChatId)
    );

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchChats(user.uid) as any);
        }
    }, [dispatch, user]);

    const handleChatSelect = useCallback((chatId: string) => {
        setSelectedChatId(chatId);
        dispatch(fetchMessages(chatId) as any);
    }, [dispatch]);

    const handleSendMessage = useCallback((text: string) => {
        if (selectedChatId && user?.uid) {
            dispatch(sendMessage(selectedChatId, user.uid, text) as any);
        }
    }, [dispatch, selectedChatId, user]);

    return (
        <Box sx={{ display: 'flex', height: '70vh' }}>
            <Box sx={{ width: '340px', borderRight: '1px solid #e0e0e0', overflowY: 'auto' }}>
                <ChatList
                    chats={chats}
                    onSelectChat={handleChatSelect}
                    selectedChatId={selectedChatId}
                    loading={loading}
                />
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <ChatContent
                    messages={currentChatMessages}
                    membersData={currentChatMembersData}
                    currentUserId={user?.uid || ''}
                    onSendMessage={handleSendMessage}
                    loading={loading && currentChatMessages.length === 0}
                />
            </Box>
        </Box>
    );
};

export default Chats;