import React from 'react';
import {Button as MuiButton, ButtonProps as MuiButtonProps} from '@mui/material';

interface CustomButtonProps extends Omit<MuiButtonProps, 'variant' | 'color'> {
    variant?: 'text' | 'outlined' | 'contained';
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'inherit';
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
            color={variant === 'text' ? 'inherit' : color}
            fullWidth={fullWidth}
            sx={{
                borderRadius: rounded ? '18px' : '4px',
                textTransform: 'none',
                padding: '10px 20px',
                boxShadow: 'none',
                '&:hover': variant !== 'text' ? {
                    backgroundColor: color === 'primary' ? '#5BFEC5' : undefined,
                    boxShadow: 'none',
                } : {},
                ...(variant === 'text' && {
                    color: '#97A4A5',
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                }),
                ...sx,
            }}
            {...props}
        >
            {children}
        </MuiButton>
    );
};

export default Button;