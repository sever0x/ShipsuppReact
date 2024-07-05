import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Box, Button, CircularProgress, Container, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import useAuth from 'misc/hooks/useAuth';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import {fetchUserProfile} from '../actions/profileActions';
import {RootState} from 'app/reducers';
import EditProfile from '../components/EditProfile';

const Profile: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile);
    const [isEditing, setIsEditing] = useState(false);

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
            {isEditing ? (
                <EditProfile onCancel={() => setIsEditing(false)} />
            ) : (
                <>
                    <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                        <Box position="relative">
                            <Avatar
                                src={profile.data?.profilePhoto}
                                alt={`${profile.data?.firstName} ${profile.data?.lastName}`}
                                sx={{ width: 100, height: 100, mb: 2 }}
                            />
                        </Box>
                        <Typography variant="h4" gutterBottom>User Profile</Typography>
                    </Box>
                    <Typography variant="body1">Email: {user.email}</Typography>
                    <Typography variant="body1">UID: {user.uid}</Typography>
                    {profile.data && (
                        <>
                            <Typography variant="body1">First Name: {profile.data.firstName}</Typography>
                            <Typography variant="body1">Last Name: {profile.data.lastName}</Typography>
                            <Typography variant="body1">Phone: {profile.data.phone}</Typography>
                            {profile.data.port && (
                                <Typography variant="body1">
                                    Port: {profile.data.port.title} ({profile.data.port.city.title}, {profile.data.port.city.country.title})
                                </Typography>
                            )}
                        </>
                    )}
                    <Box mt={3}>
                        <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} sx={{ mr: 2 }}>
                            Edit Profile
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Box>
                </>
            )}
        </Container>
    );
};

export default Profile;