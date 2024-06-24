import React from 'react';
import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../misc/hooks/useAuth';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/signin');
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
