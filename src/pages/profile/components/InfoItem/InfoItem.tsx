import React from 'react';
import { Box } from '@mui/material';
import Typography from 'components/Typography';

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    isMobile: boolean;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value, isMobile }) => {
    return (
        <Box
            display="flex"
            alignItems="flex-start"
            mb={2}
            flexDirection={isMobile ? 'column' : 'row'}
            sx={{
                overflowWrap: 'break-word',
                wordBreak: 'break-all',
            }}
        >
            <Box mr={isMobile ? 0 : 2} mb={isMobile ? 1 : 0} color={(theme) => theme.palette.primary.main}>
                {icon}
            </Box>
            <Box width="100%">
                <Typography variant="body2" color="secondary" sx={{ width: '100%' }}>
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ width: '100%' }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
};

export default InfoItem;
