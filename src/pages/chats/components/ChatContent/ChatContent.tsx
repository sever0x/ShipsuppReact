import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Avatar, List, ListItem, ListItemAvatar, Typography, Skeleton } from '@mui/material';
import { Message } from 'pages/chats/types/Message';
import { User } from "pages/chats/types/User";
import TextField from 'components/TextField';
import Box from 'components/Box';
import IconButton from 'components/IconButton';
import { Send } from '@mui/icons-material';
import {useSelector} from "react-redux";
import {RootState} from "../../../../app/reducers";

interface ChatContentProps {
    messages: Message[];
    membersData: { [userId: string]: User };
    currentUserId: string;
    onSendMessage: (text: string) => void;
    loading: boolean;
    // selectedChatId: string | null;
}

const ChatContent: React.FC<ChatContentProps> = React.memo(({
    messages,
    membersData,
    currentUserId,
    onSendMessage,
    loading,
    // selectedChatId
}) => {
    const selectedChatId = useSelector((state: RootState) => state.chat.selectedChatId);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const prevSelectedChatIdRef = useRef<string | null>(null);

    const scrollToBottom = useCallback((smooth = true) => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({
                behavior: smooth ? 'smooth' : 'auto',
                block: 'end'
            });
        }
    }, []);

    useEffect(() => {
        if (selectedChatId !== prevSelectedChatIdRef.current) {
            setIsInitialLoad(true);
            prevSelectedChatIdRef.current = selectedChatId;
        }
    }, [selectedChatId]);

    useEffect(() => {
        if (messages.length > 0) {
            if (isInitialLoad) {
                scrollToBottom(false);
                setIsInitialLoad(false);
            } else {
                scrollToBottom(true);
            }
        }
    }, [messages, isInitialLoad, scrollToBottom]);

    const handleSendMessage = useCallback(() => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    }, [newMessage, onSendMessage]);

    useEffect(() => {
        setNewMessage('');
    }, [selectedChatId]);

    if (!selectedChatId) {
        return (
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
            }}>
                <Typography variant="h6" color="text.secondary">
                    Select a chat to start messaging
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden'
        }}>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {loading && messages.length === 0 ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <ListItem key={index}>
                            <ListItemAvatar>
                                <Skeleton variant="circular" width={40} height={40} />
                            </ListItemAvatar>
                            <Box sx={{ width: '70%' }}>
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width="60%" />
                            </Box>
                        </ListItem>
                    ))
                ) : (
                    messages.map((message) => {
                        const isSender = message.senderId === currentUserId;
                        const user = membersData[message.senderId];
                        return (
                            <Box
                                key={message.id}
                                sx={{
                                    display: 'flex',
                                    justifyContent: isSender ? 'flex-end' : 'flex-start',
                                    mb: 2,
                                }}
                            >
                                {!isSender && (
                                    <Avatar
                                        src={user?.photoUrl}
                                        alt={`${user?.firstName} ${user?.lastName}`}
                                        sx={{ mr: 1 }}
                                    />
                                )}
                                <Box
                                    sx={{
                                        maxWidth: '70%',
                                        backgroundColor: isSender ? '#e3f2fd' : '#f5f5f5',
                                        borderRadius: 2,
                                        padding: 2,
                                    }}
                                >
                                    <Typography variant="body1">{message.text}</Typography>
                                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                                        {new Date(message.createTimestampGMT).toLocaleString()}
                                    </Typography>
                                </Box>
                                {isSender && (
                                    <Avatar
                                        src={user?.photoUrl}
                                        alt={`${user?.firstName} ${user?.lastName}`}
                                        sx={{ ml: 1 }}
                                    />
                                )}
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 2,
                borderTop: '1px solid #e0e0e0',
                marginTop: 2
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    sx={{ mr: 1 }}
                    autoComplete="off"
                />
                <IconButton
                    color="primary"
                    onClick={handleSendMessage}
                    sx={{ backgroundColor: '#e3f2fd', '&:hover': { backgroundColor: '#bbdefb' } }}
                >
                    <Send />
                </IconButton>
            </Box>
        </Box>
    );
});

const areEqual = (prevProps: ChatContentProps, nextProps: ChatContentProps) => {
    return prevProps.messages === nextProps.messages &&
        prevProps.loading === nextProps.loading;
};

export default React.memo(ChatContent, areEqual);