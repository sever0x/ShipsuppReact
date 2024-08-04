import './ChatContent.css';

import React, {useEffect, useRef, useState} from 'react';
import {Avatar, List, ListItem, ListItemAvatar, Typography} from '@mui/material';
import {Message} from 'pages/chats/types/Message';
import {User} from "pages/chats/types/User";
import TextField from 'components/TextField';
import Box from 'components/Box';
import IconButton from 'components/IconButton';
import {Send} from '@mui/icons-material';

interface ChatContentProps {
    messages: Message[];
    membersData: { [userId: string]: User };
    currentUserId: string;
    onSendMessage: (text: string) => void;
}

const ChatContent: React.FC<ChatContentProps> = ({ messages, membersData, currentUserId, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage.trim());
            setNewMessage('');
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <List sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
                {messages.map((message) => {
                    const isSender = message.senderId === currentUserId;
                    const user = membersData[message.senderId];
                    const timestamp = message.createTimestampGMT || message.localTimestamp;

                    return (
                        <ListItem
                            key={message.id}
                            sx={{
                                flexDirection: isSender ? 'row-reverse' : 'row',
                                alignItems: 'flex-start',
                                mb: 2,
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} />
                            </ListItemAvatar>
                            <Box sx={{
                                maxWidth: '70%',
                                ml: isSender ? 0 : 0,
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
                })}
                <div ref={messagesEndRef} />
            </List>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                padding: 2,
                borderTop: '1px solid #e0e0e0'
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
};

export default ChatContent;