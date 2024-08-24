import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    IconButton,
    TextField,
    useTheme,
} from '@mui/material';
import { CloudUpload, Save, Cancel } from '@mui/icons-material';
import { RootState } from '../../../../app/reducers';
import { updateProfile, updateProfilePhoto } from '../../actions/profileActions';
import Typography from 'components/Typography';

interface EditProfileProps {
    onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onCancel }) => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const profile = useSelector((state: RootState) => state.profile.data);
    const [formData, setFormData] = useState(profile);
    const [isUploading, setIsUploading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(updateProfile(profile.id, formData) as any);
        onCancel();
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsUploading(true);
            try {
                const photoURL = await dispatch(updateProfilePhoto(profile.id, file) as any);
                setFormData((prev: any) => ({ ...prev, profilePhoto: photoURL }));
            } catch (error) {
                console.error('Failed to upload photo:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const OutlinedBox = ({ children, sx }: { children: React.ReactNode; sx?: any }) => (
        <Box
            sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: 'white',
                '&:hover': {
                    boxShadow: `0 0 0 1px ${theme.palette.primary.main}`,
                },
                ...sx,
            }}
        >
            {children}
        </Box>
    );

    return (
        <Container maxWidth="xl">
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <OutlinedBox>
                            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                                <Box position="relative">
                                    <Avatar
                                        src={formData.profilePhoto}
                                        alt={`${formData.firstName} ${formData.lastName}`}
                                        sx={{ width: 120, height: 120, mb: 2 }}
                                    />
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            backgroundColor: theme.palette.background.paper,
                                            '&:hover': { backgroundColor: theme.palette.action.hover },
                                        }}
                                        component="label"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? <CircularProgress size={24} /> : <CloudUpload />}
                                        <input
                                            type="file"
                                            hidden
                                            onChange={handlePhotoUpload}
                                            accept="image/*"
                                        />
                                    </IconButton>
                                </Box>
                                <Typography variant="h5" gutterBottom>Edit Profile</Typography>
                            </Box>
                            <Box mt={2}>
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<Save />}
                                    sx={{ mb: 1 }}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="secondary"
                                    onClick={onCancel}
                                    startIcon={<Cancel />}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </OutlinedBox>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <OutlinedBox>
                            <Typography variant="h6" gutterBottom>Personal Information</Typography>
                            <Grid container spacing={2} pt={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="firstName"
                                        label="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        name="lastName"
                                        label="Last Name"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="phone"
                                        label="Phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </OutlinedBox>
                        <OutlinedBox sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>Account Details</Typography>
                            <Grid container spacing={2} pt={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="currentPlan"
                                        label="Current ShipSupp Plan"
                                        value={formData.currentPlan}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        name="commercialPlan"
                                        label="Commercial Plan"
                                        value={formData.commercialPlan}
                                        onChange={handleChange}
                                        variant="outlined"
                                    />
                                </Grid>
                            </Grid>
                        </OutlinedBox>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default EditProfile;