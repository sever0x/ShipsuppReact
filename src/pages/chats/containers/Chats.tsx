import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Paper, Typography } from '@mui/material';
import { RootState } from 'app/reducers';
import { fetchChats, fetchMessages, sendMessage } from "../actions/chatActions";
import ChatList from '../components/ChatList';
import ChatContent from '../components/ChatContent';

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
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Paper style={{ height: '100%' }}>
                    <ChatList
                        chats={chats}
                        onSelectChat={handleChatSelect}
                        selectedChatId={selectedChatId}
                    />
                </Paper>
            </Grid>
            <Grid item xs={9}>
                <Paper style={{ height: '100%', padding: '20px' }}>
                    {selectedChatId ? (
                        <ChatContent
                            messages={messages[selectedChatId] || []}
                            membersData={chats.find(chat => chat.id === selectedChatId)?.membersData || {}}
                            currentUserId={user?.uid || ''}
                            onSendMessage={handleSendMessage}
                        />
                    ) : (
                        <Typography>Select a chat to view messages</Typography>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Chats;