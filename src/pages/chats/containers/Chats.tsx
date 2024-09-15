import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'app/reducers';
import {
    fetchChats,
    fetchMessages, resetSelectedChatId,
    resetUnreadCount,
    sendMessage,
    setSelectedChatId,
    setupMessageListener,
    setupRealtimeListeners
} from "../actions/chatActions";
import ChatList from '../components/ChatList';
import ChatContent from '../components/ChatContent';
import Box from 'components/Box';
import {createSelector} from 'reselect';
import {IconButton, useMediaQuery, useTheme} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";

const selectChat = (state: RootState) => state.chat;
const selectSelectedChatId = (state: RootState) => state.chat.selectedChatId;

const selectCurrentChatMessages = createSelector(
    [selectChat, selectSelectedChatId],
    (chat, selectedChatId) => selectedChatId ? chat.messages[selectedChatId] || [] : []
);

const selectCurrentChatMembersData = createSelector(
    [selectChat, selectSelectedChatId],
    (chat, selectedChatId) => {
        const selectedChat = chat.chats.find(c => c.id === selectedChatId);
        return selectedChat ? selectedChat.membersData : {};
    }
);

const Chats: React.FC = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.userAuth.user);
    const { chats, loading, selectedChatId } = useSelector((state: RootState) => state.chat);
    const prevSelectedChatIdRef = useRef<string | null>(null);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [showChatList, setShowChatList] = useState(true);

    const currentChatMessages = useSelector((state: RootState) =>
        selectCurrentChatMessages(state)
    );
    const currentChatMembersData = useSelector((state: RootState) =>
        selectCurrentChatMembersData(state)
    );

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchChats(user.uid) as any);
            const unsubscribe = dispatch(setupRealtimeListeners(user.uid) as any);
            return () => unsubscribe();
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (selectedChatId && user?.uid && selectedChatId !== prevSelectedChatIdRef.current) {
            dispatch(fetchMessages(selectedChatId) as any);
            const unsubscribe = dispatch(setupMessageListener(selectedChatId, user.uid) as any);
            prevSelectedChatIdRef.current = selectedChatId;
            return () => {
                if (typeof unsubscribe === 'function') {
                    unsubscribe();
                }
            };
        }
    }, [dispatch, selectedChatId, user]);

    const handleChatSelect = useCallback((chatId: string) => {
        if (chatId !== selectedChatId) {
            dispatch(setSelectedChatId(chatId));
            dispatch(fetchMessages(chatId) as any);
            if (isSmallScreen) {
                setShowChatList(false);
            }
        }
    }, [dispatch, selectedChatId, isSmallScreen]);

    const handleBackToList = () => {
        setShowChatList(true);
        dispatch(resetSelectedChatId());
    };

    const handleSendMessage = useCallback((text: string) => {
        if (selectedChatId && user?.uid) {
            dispatch(sendMessage(selectedChatId, user.uid, text) as any);
            dispatch(resetUnreadCount(selectedChatId, user.uid) as any);
        }
    }, [dispatch, selectedChatId, user]);

    return (
        <Box sx={{
            display: 'flex',
            height: '80vh',
            overflow: 'hidden',
            width: '100%',
        }}>
            {(!isSmallScreen || (isSmallScreen && showChatList)) && (
                <Box sx={{
                    width: isSmallScreen ? '100%' : '340px',
                    flexShrink: 0,
                    borderRight: '1px solid #e0e0e0',
                    overflowY: 'auto',
                    height: '100%'
                }}>
                    <ChatList
                        chats={chats}
                        onSelectChat={handleChatSelect}
                        selectedChatId={selectedChatId}
                        loading={loading}
                        currentUserId={user?.uid ?? ''}
                    />
                </Box>
            )}
            {(!isSmallScreen || (isSmallScreen && !showChatList)) && (
                <Box sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    overflow: 'hidden',
                    width: isSmallScreen ? '100%' : 'calc(100% - 340px)',
                }}>
                    <ChatContent
                        messages={currentChatMessages}
                        membersData={currentChatMembersData}
                        currentUserId={user?.uid || ''}
                        onSendMessage={handleSendMessage}
                        loading={loading && currentChatMessages.length === 0}
                        onBackClick={isSmallScreen ? handleBackToList : undefined}
                    />
                </Box>
            )}
        </Box>
    );
};

export default Chats;