import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';

interface CustomButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    rounded?: boolean;
}

const Button: React.FC<CustomButtonProps> = ({
    variant = 'contained',
    color = 'primary',
    rounded = true,
    fullWidth = false,
    sx,
    children,
    ...props
}) => {
    return (
        <MuiButton
            variant={variant}
            color={color}
            fullWidth={fullWidth}
            sx={{
                borderRadius: rounded ? '16px' : '4px',
                textTransform: 'none',
                padding: '10px 20px',
                '&:hover': {
                    backgroundColor: color === 'primary' ? '#5BFEC5' : undefined,
                },
                ...sx,
            }}
            {...props}
        >
            {children}
        </MuiButton>
    );
};

export default Button;