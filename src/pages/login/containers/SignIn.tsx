import React, { useState } from 'react';
import { createUseStyles } from "react-jss";
import useTheme from "misc/hooks/useTheme";
import Stack from "components/Stack";
import Logo from '../../../components/Logo';
import SignInForm from '../components/SignInForm';
import { Snackbar, Alert } from "@mui/material";

const getClasses = createUseStyles(() => ({
    container: {
        height: '100vh',
        // backgroundImage: `url(static/images/login/background.png)`,
        // backgroundSize: 'cover',
        // backgroundPosition: 'center',
        // backgroundRepeat: 'no-repeat',
        // backgroundAttachment: 'fixed',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
    }
}));

const SignInPage = () => {
    const { theme } = useTheme();
    const classes = getClasses({ theme });
    const [error, setError] = useState<string | null>(null);

    const handleError = (errorMessage: string) => {
        console.log("Error set:", errorMessage);
        setError(errorMessage);
    };

    const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(null);
    };

    const handleCloseAlert = (_event: React.SyntheticEvent) => {
        setError(null);
    };

    return (
        <div className={`${classes.container} ${classes.center}`}>
            <Stack
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '516px',
                    backgroundColor: 'white',
                    height: '100vh',
                    padding: '48px 48px',
                }}
            >
                <div className={classes.center}>
                    <Logo />
                </div>
                <Stack sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <SignInForm onError={handleError} />
                </Stack>
            </Stack>
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SignInPage;