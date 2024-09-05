import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Avatar, Skeleton, Typography} from '@mui/material';
import {Message} from 'pages/chats/types/Message';
import {User} from "pages/chats/types/User";
import TextField from 'components/TextField';
import Box from 'components/Box';
import IconButton from 'components/IconButton';
import {Send} from '@mui/icons-material';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../../app/reducers";
import {markMessagesAsRead, resetUnreadCount, watchAndResetUnreadCount} from "pages/chats/actions/chatActions";
import {DEV_MODE} from "../../../../constants/config";

interface ChatContentProps {
    messages: Message[];
    membersData: { [userId: string]: User };
    currentUserId: string;
    onSendMessage: (text: string) => void;
    loading: boolean;
}

const ChatContent: React.FC<ChatContentProps> = React.memo(({
                                                                messages,
                                                                membersData,
                                                                currentUserId,
                                                                onSendMessage,
                                                                loading,
                                                            }) => {
    const dispatch = useDispatch();
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
        if (DEV_MODE) {
            console.log('ChatContent.tsx: selectedChatId changed = ', selectedChatId);
        }
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

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop - clientHeight <= 1) {
            if (selectedChatId) {
                dispatch(markMessagesAsRead(selectedChatId, currentUserId) as any);
            }
        }
    }, [dispatch, selectedChatId, currentUserId]);

    useEffect(() => {
        if (selectedChatId && messages.length > 0) {
            dispatch(markMessagesAsRead(selectedChatId, currentUserId) as any);
        }
    }, [dispatch, selectedChatId, currentUserId, messages]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        if (selectedChatId) {
            unsubscribe = dispatch(watchAndResetUnreadCount(selectedChatId, currentUserId) as any);
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [dispatch, selectedChatId, currentUserId]);

    useEffect(() => {
        if (selectedChatId && messages.length > 0) {
            dispatch(resetUnreadCount(selectedChatId, currentUserId) as any);
        }
    }, [dispatch, selectedChatId, currentUserId, messages]);

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

    const otherUser = Object.values(membersData).find(user => user.id !== currentUserId);

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            overflow: 'hidden',
            maxWidth: '100%',
        }}>
            <Box sx={{
                padding: 2,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Avatar src={otherUser?.photoUrl} alt={`${otherUser?.firstName} ${otherUser?.lastName}`} sx={{ mr: 2 }} />
                <Typography variant="h6">{`${otherUser?.firstName} ${otherUser?.lastName}`}</Typography>
            </Box>
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onScroll={handleScroll}
                className="chat-content-list"
            >
                {loading && messages.length === 0 ? (
                    Array.from({ length: 5 }).map((_, index) => (
                        <Box key={index} sx={{ display: 'flex', mb: 2 }}>
                            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                            <Box sx={{ width: '70%' }}>
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width="60%" />
                            </Box>
                        </Box>
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
                                        pt: 1,
                                        pb: 1,
                                        pr: 2,
                                        pl: 2,
                                        wordWrap: 'break-word',
                                        overflowWrap: 'break-word',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
                                        {isSender ? 'You' : `${user?.firstName} ${user?.lastName}`}
                                    </Typography>
                                    <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{message.text}</Typography>
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

export default React.memo(ChatContent);