import React from 'react';
import {Avatar, Box, CircularProgress, IconButton, useTheme} from '@mui/material';
import {CloudUpload} from '@mui/icons-material';
import Typography from 'components/Typography';

interface PhotoUploadProps {
    profilePhoto: string;
    firstName: string;
    lastName: string;
    isUploading: boolean;
    handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ profilePhoto, firstName, lastName, isUploading, handlePhotoUpload }) => {
    const theme = useTheme();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileType = file.type.toLowerCase();
            if (fileType === 'image/png' || fileType === 'image/jpeg' || fileType === 'video/webm') {
                handlePhotoUpload(e);
            } else {
                alert('Please select a file in .png, .jpg or .webm format');
                e.target.value = '';
            }
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <Box position="relative">
                <Avatar
                    src={profilePhoto}
                    alt={`${firstName} ${lastName}`}
                    sx={{
                        width: { xs: 80, sm: 120 },
                        height: { xs: 80, sm: 120 },
                        mb: 2
                    }}
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
                        onChange={handleFileChange}
                        accept=".png,.jpg,.jpeg,.webm"
                    />
                </IconButton>
            </Box>
            <Typography variant="h5" gutterBottom align="center">Edit Profile</Typography>
        </Box>
    );
};

export default PhotoUpload;