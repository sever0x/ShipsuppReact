import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Box, Button, Container, Grid, useMediaQuery, useTheme} from '@mui/material';
import {Cancel, Save} from '@mui/icons-material';
import {RootState} from '../../../../app/reducers';
import {updateProfile, updateProfilePhoto} from '../../actions/profileActions';
import Typography from 'components/Typography';
import OutlinedBox from '../OutlinedBox';
import PersonalInformationForm from '../PersonalInformationForm';
import PhotoUpload from '../PhotoUpload';
import SelectedPortsModal from 'components/SelectedPorts';
import actions from "../../../../misc/actions/portsActions";
import {useAppDispatch} from "../../../../misc/hooks/useAppDispatch";

interface EditProfileProps {
    onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onCancel }) => {
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const profile = useSelector((state: RootState) => state.profile.data);
    const ports = useSelector((state: RootState) => state.ports.data);
    const [formData, setFormData] = useState(profile);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedPorts, setSelectedPorts] = useState(profile.portsArray.map((port: any) => port.id));
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(actions.fetchPorts());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePortSelect = (portId: string) => {
        setSelectedPorts((prev: string[]) => {
            if (prev.includes(portId)) {
                return prev.filter(id => id !== portId);
            } else {
                return [...prev, portId];
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedFormData = {
            ...formData,
            portsArray: selectedPorts.map((portId: string | number) => ports[portId]).filter(Boolean)
        };
        dispatch(updateProfile(profile.id, updatedFormData) as any);
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

    const handlePortRemove = (portId: string) => {
        setSelectedPorts((prev: any[]) => prev.filter(id => id !== portId));
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
                        </OutlinedBox>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <OutlinedBox>
                            <Typography variant="h6" gutterBottom>Personal Information</Typography>
                            <PersonalInformationForm formData={formData} handleChange={handleChange} />
                            {/*<Box mt={2}>*/}
                            {/*    <PortSelector*/}
                            {/*        ports={ports}*/}
                            {/*        selectedPorts={selectedPorts}*/}
                            {/*        onPortSelect={handlePortSelect}*/}
                            {/*    />*/}
                            {/*    {selectedPorts.length > 0 && (*/}
                            {/*        <Button*/}
                            {/*            startIcon={<Visibility />}*/}
                            {/*            onClick={() => setIsModalOpen(true)}*/}
                            {/*            variant="text"*/}
                            {/*            size="small"*/}
                            {/*            color="info"*/}
                            {/*            sx={{ mt: 1 }}*/}
                            {/*        >*/}
                            {/*            View Selected Ports ({selectedPorts.length})*/}
                            {/*        </Button>*/}
                            {/*    )}*/}
                            {/*</Box>*/}
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
                </Grid>
            </form>
            <SelectedPortsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPorts={selectedPorts.map((id: string | number) => ports[id]).filter(Boolean)}
                onRemove={handlePortRemove}
            />
        </Container>
    );
};

export default EditProfile;