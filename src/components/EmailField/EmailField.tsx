import React from 'react';
import { InputAdornment } from '@mui/material';
import { Email } from '@mui/icons-material';
import TextField from "../TextField";

interface EmailFieldProps {
    email: string;
    setEmail: (email: string) => void;
}

const EmailField: React.FC<EmailFieldProps> = ({ email, setEmail }) => (
    <TextField
        id="email"
        placeholder="Email"
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{
            '& .MuiOutlinedInput-root': {
                '& fieldset': { borderRadius: '16px' },
                '&:hover fieldset': { borderColor: '#000' },
                '&.Mui-focused fieldset': { borderColor: '#000' },
            },
            '& .MuiInputLabel-root': {
                '&.Mui-focused': { color: '#000' },
            },
        }}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <Email />
                </InputAdornment>
            ),
        }}
    />
);

export default EmailField;