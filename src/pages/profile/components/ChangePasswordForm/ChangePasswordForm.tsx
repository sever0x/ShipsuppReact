import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TextField, CircularProgress, Snackbar, Alert } from '@mui/material';
import { RootState } from 'app/reducers';
import useAuth from 'misc/hooks/useAuth';
import { changePassword } from "pages/profile/actions/profileActions";
import LockResetIcon from '@mui/icons-material/LockReset';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
}

const ChangePasswordForm: React.FC = () => {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { changingPassword } = useSelector((state: RootState) => state.profile);
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [validationError, setValidationError] = useState('');
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'info'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationError('');
    };

    const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const showNotification = (message: string, severity: SnackbarState['severity']) => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.uid) {
            showNotification('User not authenticated', 'error');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setValidationError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setValidationError('Password must be at least 6 characters long');
            return;
        }

        const result = await dispatch(changePassword({
            userId: user.uid,
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword
        }) as any);

        if (result.success) {
            showNotification('Password successfully changed', 'success');
            // Clear form after successful password change
            setFormData({
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            showNotification(result.error, 'error');
        }
    };

    return (
        <>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    margin="normal"
                    type="password"
                    name="newPassword"
                    label="New Password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    error={!!validationError && formData.newPassword.length > 0}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    type="password"
                    name="confirmPassword"
                    label="Confirm New Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    error={!!validationError}
                    helperText={validationError}
                />
                <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={changingPassword}
                    startIcon={changingPassword ? <CircularProgress size={20} color="inherit" /> : <LockResetIcon />}
                    sx={{ mt: 2 }}
                >
                    {changingPassword ? 'Changing Password...' : 'Change Password'}
                </Button>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ChangePasswordForm;