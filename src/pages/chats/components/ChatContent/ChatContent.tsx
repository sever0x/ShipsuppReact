import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Avatar, ListItem, ListItemAvatar, Typography, Skeleton } from '@mui/material';
import { Message } from 'pages/chats/types/Message';
import { User } from "pages/chats/types/User";
import TextField from 'components/TextField';
import Box from 'components/Box';
import IconButton from 'components/IconButton';
import { Send } from '@mui/icons-material';
import { FixedSizeList as VirtualizedList, ListChildComponentProps } from 'react-window';

interface ChatContentProps {
    messages: Message[];
    membersData: { [userId: string]: User };
    currentUserId: string;
    onSendMessage: (text: string) => void;
    loading: boolean;
    selectedChatId: string | null;
}

const ChatContent: React.FC<ChatContentProps> = React.memo(({
    messages,
    membersData,
    currentUserId,
    onSendMessage,
    loading,
    selectedChatId
}) => {
    const [newMessage, setNewMessage] = useState('');
    const listRef = useRef<VirtualizedList>(null);
    const [listHeight, setListHeight] = useState(500);

    const scrollToBottom = useCallback(() => {
        if (listRef.current) {
            listRef.current.scrollToItem(messages.length - 1, 'end');
        }
    }, [messages]);

    useEffect(() => {
        const updateHeight = () => {
            const vh = window.innerHeight * 0.7;
            setListHeight(vh);
        };

        updateHeight();

        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    useEffect(scrollToBottom, [scrollToBottom]);

    const handleSendMessage = useCallback(() => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    }, [newMessage, onSendMessage]);

    const renderRow = useCallback(({ index, style }: ListChildComponentProps) => {
        const message = messages[index];
        const isSender = message.senderId === currentUserId;
        const user = membersData[message.senderId];
        const timestamp = message.createTimestampGMT ?? message.localTimestamp;

        return (
            <ListItem
                key={message.id}
                style={style}
                sx={{
                    flexDirection: isSender ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                }}
            >
                <ListItemAvatar>
                    <Avatar src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} />
                </ListItemAvatar>
                <Box sx={{
                    maxWidth: '70%',
                    ml: isSender ? 0 : 2,
                    mr: isSender ? 2 : 0,
                    backgroundColor: isSender ? '#e3f2fd' : '#f5f5f5',
                    borderRadius: 2,
                    padding: 2,
                }}>
                    <Typography variant="body1">{message.text}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                        {new Date(timestamp).toLocaleString()}
                    </Typography>
                </Box>
            </ListItem>
        );
    }, [messages, membersData, currentUserId]);

    const renderSkeletonRow = useCallback(({ index, style }: ListChildComponentProps) => (
        <ListItem key={index} style={style}>
            <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <Box sx={{ width: '70%' }}>
                <Skeleton variant="text" width="100%" />
                <Skeleton variant="text" width="60%" />
            </Box>
        </ListItem>
    ), []);

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
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {loading && messages.length === 0 ? (
                <VirtualizedList
                    height={listHeight}
                    itemCount={5}
                    itemSize={80}
                    width="100%"
                >
                    {renderSkeletonRow}
                </VirtualizedList>
            ) : (
                <VirtualizedList
                    height={listHeight}
                    itemCount={messages.length}
                    itemSize={80}
                    width="100%"
                    ref={listRef}
                >
                    {renderRow}
                </VirtualizedList>
            )}
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 2,
                borderTop: '1px solid #e0e0e0',
                mt: 1
            }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    sx={{ mr: 1 }}
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

export default ChatContent;