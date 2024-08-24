import React from 'react';
import { Paper, SxProps } from '@mui/material';

interface OutlinedBoxProps {
    children: React.ReactNode;
    sx?: SxProps;
}

const OutlinedBox: React.FC<OutlinedBoxProps> = ({ children, sx }) => {
    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 2, sm: 3 },
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

export default OutlinedBox;
