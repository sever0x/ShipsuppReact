import './ChatContent.css';

import React, {useEffect, useRef, useState} from 'react';
import {Avatar, List, ListItem, Paper, Typography} from '@mui/material';
import {Message} from 'pages/chats/types/Message';
import {User} from "pages/chats/types/User";
import TextField from 'components/TextField';
import Button from 'components/Button';

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
        <Paper style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
            <List
                className="chat-content-list"
                style={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                }}
            >
                <div ref={messagesEndRef} />
                {messages.slice().reverse().map((message) => {
                    const isSender = message.senderId === currentUserId;
                    const user = membersData[message.senderId];
                    const timestamp = message.createTimestampGMT || message.localTimestamp;

                    return (
                        <ListItem
                            key={message.id}
                            style={{
                                flexDirection: isSender ? 'row-reverse' : 'row',
                                alignItems: 'flex-start',
                            }}
                        >
                            <Avatar src={user.photoUrl} alt={`${user.firstName} ${user.lastName}`} />
                            <div style={{
                                maxWidth: '70%',
                                marginLeft: isSender ? 0 : '10px',
                                marginRight: isSender ? '10px' : 0
                            }}>
                                <Paper elevation={2} style={{
                                    padding: '10px',
                                    backgroundColor: isSender ? '#DCF8C6' : '#FFFFFF'
                                }}>
                                    <Typography variant="body1">{message.text}</Typography>
                                </Paper>
                                <Typography variant="caption" style={{ marginTop: '5px' }}>
                                    {new Date(timestamp).toLocaleString()}
                                </Typography>
                            </div>
                        </ListItem>
                    );
                })}
            </List>
            <Paper elevation={3} style={{ padding: '10px', display: 'flex' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    style={{ marginLeft: '10px' }}
                >
                    Send
                </Button>
            </Paper>
        </Paper>
    );
};

export default ChatContent;