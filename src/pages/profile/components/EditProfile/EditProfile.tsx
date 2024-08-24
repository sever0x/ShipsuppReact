import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Box, Button, Container, Grid, useMediaQuery, useTheme,} from '@mui/material';
import {Cancel, Save} from '@mui/icons-material';
import {RootState} from '../../../../app/reducers';
import {updateProfile, updateProfilePhoto} from '../../actions/profileActions';
import Typography from 'components/Typography';
import OutlinedBox from '../OutlinedBox';
import PersonalInformationForm from '../PersonalInformationForm';
import PhotoUpload from '../PhotoUpload';

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

    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container maxWidth="xl" sx={{
            paddingLeft: 0,
            paddingRight: 0,
            [theme.breakpoints.up('sm')]: {
                paddingLeft: 0,
                paddingRight: 0,
            },
        }}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <OutlinedBox>
                            <PhotoUpload
                                profilePhoto={formData.profilePhoto}
                                firstName={formData.firstName}
                                lastName={formData.lastName}
                                isUploading={isUploading}
                                handlePhotoUpload={handlePhotoUpload}
                            />
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
                            <PersonalInformationForm formData={formData} handleChange={handleChange} />
                        </OutlinedBox>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default EditProfile;
