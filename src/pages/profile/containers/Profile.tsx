import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import useAuth from 'misc/hooks/useAuth';
import {fetchPortSubscriptions, fetchUserProfile} from '../actions/profileActions';
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
import InfoItem from '../components/InfoItem';
import OutlinedBox from '../components/OutlinedBox';
import StyledPortsAccordion from '../components/StyledPortsAccordion';
import { Port } from 'misc/types/Port';
import ChangePasswordForm from '../components/ChangePasswordForm';

interface GroupedPorts {
    [countryId: string]: {
        country: {
            id: string;
            title: string;
        };
        ports: Port[];
    };
}

const Profile: React.FC = () => {
    const { user } = useAuth();
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const profile = useSelector((state: RootState) => state.profile);
    const subscriptions = useSelector((state: RootState) => state.portSubscriptions.data);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user?.uid) {
            dispatch(fetchUserProfile(user.uid) as any);
            dispatch(fetchPortSubscriptions(user.uid) as any);
        }
    }, [user, dispatch]);

    if (!user) {
        return <Typography variant="body1">No user is logged in</Typography>;
    }

    if (profile.loading && !profile.data) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (profile.error && !profile.data) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <Typography color="error">{profile.error}</Typography>
            </Box>
        );
    }

    const getActivePorts = (): Port[] => {
        return Object.values(subscriptions)
            .filter(subscription => subscription.status === 'ACTIVE')
            .map(subscription => subscription.port);
    };

    const groupPorts = (): GroupedPorts => {
        const activePorts = getActivePorts();

        return activePorts.reduce((acc: GroupedPorts, port: Port) => {
            const countryId = port.city.country.id;
            if (!acc[countryId]) {
                acc[countryId] = {
                    country: port.city.country,
                    ports: []
                };
            }
            acc[countryId].ports.push(port);
            return acc;
        }, {} as GroupedPorts);
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
                                    sx={{ width: { xs: 80, sm: 120 }, height: { xs: 80, sm: 120 }, mb: 2 }}
                                />
                                <Typography variant="h5" align="center">
                                    {`${profile.data?.firstName} ${profile.data?.lastName}`}
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
                            <Grid container spacing={2} pt={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<EmailIcon />}
                                        label="Email"
                                        value={user.email || 'Not provided'}
                                        isMobile={isMobile}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<PhoneIcon />}
                                        label="Phone"
                                        value={profile.data?.phone || 'Not provided'}
                                        isMobile={isMobile}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InfoItem
                                        icon={<LocationOnIcon />}
                                        label="Ports"
                                        value={
                                            Object.keys(subscriptions).length > 0 ? (
                                                <StyledPortsAccordion
                                                    groupedPorts={groupPorts()}
                                                    subscriptions={subscriptions}
                                                />
                                            ) : 'No ports assigned'
                                        }
                                        isMobile={isMobile}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<FingerprintIcon />}
                                        label="UID"
                                        value={user.uid}
                                        isMobile={isMobile}
                                    />
                                </Grid>
                            </Grid>
                        </OutlinedBox>
                        <OutlinedBox sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Account Details
                            </Typography>
                            <Grid container spacing={2} pt={2}>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<WorkIcon />}
                                        label="Current ShipSupp Plan"
                                        value={profile.data?.currentPlan || 'Not available'}
                                        isMobile={isMobile}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <InfoItem
                                        icon={<DateRangeIcon />}
                                        label="Joined ShipSupp"
                                        value={profile.data?.registrationDate || 'Not available'}
                                        isMobile={isMobile}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <InfoItem
                                        icon={<WorkIcon />}
                                        label="Commercial Plan"
                                        value={profile.data?.commercialPlan || 'Not available'}
                                        isMobile={isMobile}
                                    />
                                </Grid>
                            </Grid>
                        </OutlinedBox>
                        <OutlinedBox sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Security
                            </Typography>
                            <Typography variant="body2" color="secondary" sx={{ mb: 2 }}>
                                Change your password to keep your account secure
                            </Typography>
                            <ChangePasswordForm />
                        </OutlinedBox>
                    </Grid>
                </Grid>
            )}
        </Container>
    );
};

export default Profile;