import React from 'react';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';
import {Chat} from "pages/chats/types/Chat";

interface ChatListProps {
    chats: Chat[];
    onSelectChat: (chatId: string) => void;
    selectedChatId: string | null;
}

const ChatList: React.FC<ChatListProps> = ({ chats, onSelectChat, selectedChatId }) => {
    return (
        <List>
            {chats.map((chat) => {
                const otherUser = Object.values(chat.membersData).find(user => user.role === 'BUYER');
                return (
                    <ListItem
                        key={chat.id}
                        button
                        onClick={() => onSelectChat(chat.id)}
                        selected={selectedChatId === chat.id}
                    >
                        <ListItemAvatar>
                            <Avatar src={otherUser?.photoUrl} alt={`${otherUser?.firstName} ${otherUser?.lastName}`} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${otherUser?.firstName} ${otherUser?.lastName}`}
                            secondary={
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="textPrimary"
                                >
                                    {chat.lastMessage}
                                </Typography>
                            }
                        />
                    </ListItem>
                );
            })}
        </List>
    );
};

export default ChatList;