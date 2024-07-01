import React, { useState } from 'react';
import { InputAdornment } from '@mui/material';
import {Password, Visibility, VisibilityOff} from '@mui/icons-material';
import TextField from "components/TextField";
import IconButton from "components/IconButton";

interface PasswordFieldProps {
    password: string;
    setPassword: (password: string) => void;
    placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ password, setPassword, placeholder = "Password" }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <TextField
            placeholder={placeholder}
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <Password/>
                    </InputAdornment>
                ),
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            disableRipple
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default PasswordField;