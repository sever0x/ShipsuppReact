import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Container, Typography, CircularProgress, Avatar, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from 'misc/hooks/useAuth';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import { fetchUserProfile } from '../actions/profileActions';
import { RootState } from 'app/reducers';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchUserProfile(user.uid) as any);
        }
    }, [user, dispatch]);

    const handleLogout = async () => {
        await logout();
        navigate(`${pageURLs[pages.login]}`);
    };

    if (!user) {
        return <Typography variant="body1">No user is logged in</Typography>;
    }

    if (profile.loading) {
        return <CircularProgress />;
    }

    if (profile.error) {
        return <Typography color="error">{profile.error}</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar
                    src={profile.data?.profilePhoto}
                    alt={`${profile.data?.firstName} ${profile.data?.lastName}`}
                    sx={{ width: 100, height: 100, mb: 2 }}
                />
                <Typography variant="h4" gutterBottom>User Profile</Typography>
            </Box>
            <Typography variant="body1">Email: {user.email}</Typography>
            <Typography variant="body1">UID: {user.uid}</Typography>
            {profile.data && (
                <>
                    <Typography variant="body1">First Name: {profile.data.firstName}</Typography>
                    <Typography variant="body1">Last Name: {profile.data.lastName}</Typography>
                    <Typography variant="body1">Phone: {profile.data.phone}</Typography>
                </>
            )}
            <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>
        </Container>
    );
};

export default Profile;