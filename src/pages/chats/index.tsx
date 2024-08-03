import React from 'react';
import { Typography, Container } from '@mui/material';
import Chats from "pages/chats/containers/Chats";

const ChatsPage: React.FC = () => {
    return (
        <Container maxWidth="xl">
            <Typography variant="h4" gutterBottom>Your Chats</Typography>
            <Chats />
        </Container>
    );
};

export default ChatsPage;