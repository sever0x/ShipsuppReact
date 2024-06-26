import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../misc/hooks/useAuth';
import pageURLs from "../../constants/pagesURLs";
import * as pages from "../../constants/pages";

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate(`${pageURLs[pages.login]}`);
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>User Profile</Typography>
            {user ? (
                <>
                    <Typography variant="body1">Email: {user.email}</Typography>
                    <Button variant="contained" color="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </>
            ) : (
                <Typography variant="body1">No user is logged in</Typography>
            )}
        </Container>
    );
};

export default Profile;
