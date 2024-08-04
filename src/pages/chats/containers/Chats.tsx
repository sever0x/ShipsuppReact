import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography } from '@mui/material';
import { RootState } from 'app/reducers';
import { fetchChats, fetchMessages, sendMessage } from "../actions/chatActions";
import ChatList from '../components/ChatList';
import ChatContent from '../components/ChatContent';
import Box from 'components/Box';

const Chats: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.userAuth.user);
    const { chats, messages, loading, error } = useSelector((state: RootState) => state.chat);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchChats(user.uid) as any);
        }
    }, [dispatch, user]);

    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
        dispatch(fetchMessages(chatId) as any);
    };

    const handleSendMessage = (text: string) => {
        if (selectedChatId && user?.uid) {
            dispatch(sendMessage(selectedChatId, user.uid, text) as any);
        }
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography color="error">Error: {error}</Typography>;
    }

    return (
        <Box sx={{ display: 'flex', height: '70vh' }}>
            <Box sx={{ width: '340px', borderRight: '1px solid #e0e0e0', overflowY: 'auto' }}>
                <ChatList
                    chats={chats}
                    onSelectChat={handleChatSelect}
                    selectedChatId={selectedChatId}
                />
            </Box>
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {selectedChatId ? (
                    <ChatContent
                        messages={messages[selectedChatId] || []}
                        membersData={chats.find(chat => chat.id === selectedChatId)?.membersData || {}}
                        currentUserId={user?.uid || ''}
                        onSendMessage={handleSendMessage}
                    />
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Typography>Select a chat to view messages</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Chats;