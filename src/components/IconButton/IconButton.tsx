import React from 'react';
import { IconButton as MuiIconButton, IconButtonProps as MuiIconButtonProps } from '@mui/material';

interface CustomIconButtonProps extends Omit<MuiIconButtonProps, 'color'> {
    size?: 'small' | 'medium' | 'large';
    color?: 'inherit' | 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
}

const IconButton: React.FC<CustomIconButtonProps> = ({
    size = 'medium',
    color = 'default',
    sx,
    ...props
}) => {
    return (
        <MuiIconButton
            size={size}
            color={color}
            sx={{
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                ...sx,
            }}
            {...props}
        />
    );
};

export default IconButton;