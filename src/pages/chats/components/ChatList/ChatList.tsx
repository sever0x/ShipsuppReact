import React, { useMemo } from 'react';
import { Avatar, Badge, List, ListItem, ListItemAvatar, ListItemText, Skeleton, Typography } from '@mui/material';
import { Chat } from "pages/chats/types/Chat";
import { format, isValid } from 'date-fns';

interface ChatListProps {
    chats: Chat[];
    onSelectChat: (chatId: string) => void;
    selectedChatId: string | null;
    loading: boolean;
    currentUserId: string;
}

const ChatList: React.FC<ChatListProps> = React.memo(({ chats, onSelectChat, selectedChatId, loading, currentUserId }) => {

    const formatLastMessageDate = (date: string | null | undefined) => {
        if (!date) return '';

        const messageDate = new Date(date);
        const now = new Date();

        if (messageDate.toDateString() === now.toDateString()) {
            return format(messageDate, 'HH:mm');
        } else if (messageDate.getFullYear() === now.getFullYear()) {
            return format(messageDate, 'd MMM');
        } else {
            return format(messageDate, 'd MMM yyyy');
        }
    };

    const renderedChats = useMemo(() => {
        return chats.map((chat) => {
            const otherUser = Object.values(chat.membersData).find(user => user.id !== currentUserId);
            const unreadCount = chat.unreadCount?.[currentUserId] || 0;
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
                        primary={
                            <Typography component="div" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography component="span" fontWeight="600">{`${otherUser?.firstName} ${otherUser?.lastName}`}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {formatLastMessageDate(chat.lastMessage?.date)}
                                </Typography>
                            </Typography>
                        }
                        secondary={
                            <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                                noWrap
                            >
                                {chat.lastMessage?.text ?? ''}
                            </Typography>
                        }
                    />
                </ListItem>
            );
        });
    }, [chats, currentUserId, onSelectChat, selectedChatId]);

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
            {renderedChats}
        </List>
    );
});

export default ChatList;