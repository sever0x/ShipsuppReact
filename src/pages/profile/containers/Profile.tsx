import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper, SxProps,
    useTheme,
} from '@mui/material';
import useAuth from 'misc/hooks/useAuth';
import { fetchUserProfile } from '../actions/profileActions';
import { RootState } from 'app/reducers';
import EditProfile from '../components/EditProfile';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import WorkIcon from '@mui/icons-material/Work';
import DateRangeIcon from '@mui/icons-material/DateRange';
import Typography from 'components/Typography';

interface OutlinedBoxProps {
    children: React.ReactNode;
    sx?: SxProps;
}

const Profile: React.FC = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const theme = useTheme();
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
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (profile.error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error">{profile.error}</Typography>
            </Box>
        );
    }

    const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
        <Box display="flex" alignItems="center" mb={2}>
            <Box mr={2} color={theme.palette.primary.main}>
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="secondary">
                    {label}
                </Typography>
                <Typography variant="body1">{value}</Typography>
            </Box>
        </Box>
    );

    const OutlinedBox: React.FC<OutlinedBoxProps> = ({ children, sx }) => {
        return (
            <Paper
                variant="outlined"
                sx={{
                    p: 3,
                    borderRadius: 2,
                    borderColor: theme => theme.palette.divider,
                    boxShadow: 'none',
                    backgroundColor: 'white',
                    '&:hover': {
                        boxShadow: theme => `0 0 0 1px ${theme.palette.primary.main}`,
                    },
                    ...sx,
                }}
            >
                {children}
            </Paper>
        );
    };

    return (
        <Container maxWidth="xl">
            {isEditing ? (
                <EditProfile onCancel={() => setIsEditing(false)} />
            ) : (
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <OutlinedBox>
                            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                                <Avatar
                                    src={profile.data?.profilePhoto}
                                    alt={`${profile.data?.firstName} ${profile.data?.lastName}`}
                                    sx={{ width: 120, height: 120, mb: 2 }}
                                />
                                <Typography variant="h5">{`${profile.data?.firstName} ${profile.data?.lastName}`}</Typography>
                                <Typography variant="body2" color="secondary">
                                    {profile.data.portsArray.map((port: any) => port.title).join(', ')}
                                </Typography>
                            </Box>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                startIcon={<EditIcon />}
                                onClick={() => setIsEditing(true)}
                                sx={{ mt: 2 }}
                            >
                                Edit Profile
                            </Button>
                        </OutlinedBox>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <OutlinedBox>
                            <Typography variant="h6" gutterBottom>
                                Personal Information
                            </Typography>
                            <Grid container spacing={3} pt={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem icon={<EmailIcon />} label="Email" value={user.email || 'Not provided'} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem icon={<PhoneIcon />} label="Phone" value={profile.data?.phone || 'Not provided'} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<LocationOnIcon />}
                                        label="Port & Country"
                                        value={profile.data.portsArray.map((port: any) => `${port.title}, ${port.city.country.title}`).join(', ')}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem icon={<FingerprintIcon />} label="UID" value={user.uid} />
                                </Grid>
                            </Grid>
                        </OutlinedBox>
                        <OutlinedBox sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Account Details
                            </Typography>
                            <Grid container spacing={3} pt={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem icon={<WorkIcon />} label="Current ShipSupp Plan" value={profile.data?.currentPlan || 'Not available'} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem icon={<DateRangeIcon />} label="Joined ShipSupp" value={profile.data?.registrationDate || 'Not available'} />
                                </Grid>
                                <Grid item xs={12}>
                                    <InfoItem icon={<WorkIcon />} label="Commercial Plan" value={profile.data?.commercialPlan || 'Not available'} />
                                </Grid>
                            </Grid>
                        </OutlinedBox>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default Profile;