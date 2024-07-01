import React from 'react';
import { TextField as MuiTextField, TextFieldProps, InputAdornment } from '@mui/material';

interface CustomTextFieldProps extends Omit<TextFieldProps, 'variant'> {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    variant?: 'outlined' | 'filled' | 'standard';
    rounded?: boolean;
}

const TextField: React.FC<CustomTextFieldProps> = ({
    startIcon,
    endIcon,
    variant = 'outlined',
    rounded = true,
    sx,
    InputProps,
    ...props
}) => {
    const customSx = {
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                borderRadius: rounded ? '16px' : '4px',
            },
            '&:hover fieldset': {
                borderColor: '#000',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#000',
            },
        },
        '& .MuiInputLabel-root': {
            '&.Mui-focused': {
                color: '#000',
            },
        },
        '& input[type="password"]::-ms-reveal': { display: 'none' },
        '& input[type="password"]::-ms-clear': { display: 'none' },
        '& input:-webkit-autofill': {
            transition: 'background-color 600000s 0s, color 600000s 0s',
        },
        '& input[data-autocompleted]': {
            backgroundColor: 'transparent !important',
        },
        ...sx,
    };

    const customInputProps = {
        ...InputProps,
        startAdornment: startIcon ? (
            <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : InputProps?.startAdornment,
        endAdornment: endIcon ? (
            <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : InputProps?.endAdornment,
    };

    return (
        <MuiTextField
            variant={variant}
            sx={customSx}
            InputProps={customInputProps}
            {...props}
        />
    );
};

export default TextField;