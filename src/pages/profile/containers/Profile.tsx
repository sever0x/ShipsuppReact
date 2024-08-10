import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Box, Button, CircularProgress, Container, Divider, Grid} from '@mui/material';
import useAuth from 'misc/hooks/useAuth';
import {fetchUserProfile} from '../actions/profileActions';
import {RootState} from 'app/reducers';
import EditProfile from '../components/EditProfile';
import EditIcon from '@mui/icons-material/Edit';
import Stack from 'components/Stack';
import Typography from 'components/Typography';

const Profile: React.FC = () => {
    const {user} = useAuth();
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.profile);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchUserProfile(user.uid) as any);
        }
    }, [user, dispatch]);

    if (!user) {
        return <Typography variant="body1">No user is logged in</Typography>;
    }

    if (profile.loading) {
        return <CircularProgress/>;
    }

    if (profile.error) {
        return <Typography color="error">{profile.error}</Typography>;
    }

    return (
        <Container maxWidth="lg">
            {isEditing ? (
                <EditProfile onCancel={() => setIsEditing(false)}/>
            ) : (
                <>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Box position="relative">
                                <Avatar
                                    src={profile.data?.profilePhoto}
                                    alt={`${profile.data?.firstName} ${profile.data?.lastName}`}
                                    sx={{width: 100, height: 100}}
                                />
                            </Box>
                            <Box>
                                <Typography
                                    variant="h4">{`${profile.data?.firstName} ${profile.data?.lastName}`}</Typography>
                                <Typography variant="body1" color="secondary">
                                    {profile.data.portsArray.map((port: any) => port.title).join(', ')}
                                </Typography>
                            </Box>
                        </Stack>
                        <Box>
                            <Button
                                variant="outlined"
                                startIcon={<EditIcon/>}
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        </Box>
                    </Stack>
                    <Divider sx={{mt: 3}}/>
                    <Stack sx={{mt: 3}}>
                        <Typography variant="h5" gutterBottom bold={true}>Information</Typography>
                        <Grid container spacing={3} sx={{mt: 1}}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="secondary">Email</Typography>
                                <Typography variant="body1">{user.email}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="secondary">UID</Typography>
                                <Typography variant="body1">{user.uid}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="secondary">Full Name</Typography>
                                <Typography
                                    variant="body1">{profile.data?.firstName} {profile.data?.lastName}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="secondary">Phone</Typography>
                                <Typography variant="body1">{profile.data?.phone || 'Not provided'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="secondary">Ports</Typography>
                                <Typography variant="body1">
                                    {profile.data.portsArray.map((port: any) => `${port.title} (${port.city.title}, ${port.city.country.title})`).join(', ')}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Stack>
                </>
            )}
        </Container>
    );
};

export default Profile;