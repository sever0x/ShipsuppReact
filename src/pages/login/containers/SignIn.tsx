import React from 'react';
import { createUseStyles } from "react-jss";
import useTheme from "misc/hooks/useTheme";
import Stack from "components/Stack";
import Logo from '../components/Logo';
import SignInForm from '../components/SignInForm';

const getClasses = createUseStyles((muiTheme) => ({
    container: {
        height: '100vh',
        backgroundImage: `url(static/images/login/background.png)`,
    },
}));

const SignInPage: React.FC = () => {
    const { theme } = useTheme();
    const classes = getClasses({ theme });

    return (
        <div className={classes.container}>
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
                <Logo />
                <Stack sx={{ paddingTop: '220px' }}>
                    <SignInForm />
                </Stack>
            </Stack>
        </div>
    );
};

export default SignInPage;