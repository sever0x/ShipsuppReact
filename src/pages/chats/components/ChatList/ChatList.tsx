import React from 'react';
import {List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography, Skeleton, Badge} from '@mui/material';
import { Chat } from "pages/chats/types/Chat";

interface ChatListProps {
    chats: Chat[];
    onSelectChat: (chatId: string) => void;
    selectedChatId: string | null;
    loading: boolean;
    currentUserId: string;
}

const ChatList: React.FC<ChatListProps> = React.memo(({ chats, onSelectChat, selectedChatId, loading, currentUserId }) => {
    if (loading && chats.length === 0) {
        return (
            <List sx={{ padding: 0 }}>
                {[...Array(5)].map((_, index) => (
                    <ListItem key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                        <ListItemAvatar>
                            <Skeleton variant="circular" width={40} height={40} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={<Skeleton variant="text" width="60%" />}
                            secondary={<Skeleton variant="text" width="40%" />}
                        />
                    </ListItem>
                ))}
            </List>
        );
    }

    return (
        <List sx={{ padding: 0 }}>
            {chats.map((chat) => {
                const otherUser = Object.values(chat.membersData).find(user => user.role === 'BUYER');
                const unreadCount = chat.unreadCount[currentUserId] || 0;
                return (
                    <ListItem
                        key={chat.id}
                        button
                        onClick={() => onSelectChat(chat.id)}
                        selected={selectedChatId === chat.id}
                        sx={{
                            borderBottom: '1px solid #e0e0e0',
                            '&.Mui-selected': {
                                backgroundColor: '#e3f2fd',
                            },
                        }}
                    >
                        <ListItemAvatar>
                            <Badge badgeContent={unreadCount} color="primary">
                                <Avatar src={otherUser?.photoUrl} alt={`${otherUser?.firstName} ${otherUser?.lastName}`} />
                            </Badge>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`${otherUser?.firstName} ${otherUser?.lastName}`}
                            secondary={
                                <Typography
                                    component="span"
                                    variant="body2"
                                    color="textSecondary"
                                    noWrap
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
});

export default ChatList;