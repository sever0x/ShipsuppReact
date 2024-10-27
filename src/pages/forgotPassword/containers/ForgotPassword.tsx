import React from 'react';
import useTheme from "../../../misc/hooks/useTheme";
import Stack from "../../../components/Stack";
import Logo from "../../../components/Logo";
import {createUseStyles} from "react-jss";
import FpForm from "pages/forgotPassword/components";

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

const ForgotPassword = () => {
    const { theme } = useTheme();
    const classes = getClasses({ theme });

    return (
        <div className={classes.container + ' ' + classes.center}>
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
                    <Logo/>
                </div>
                <Stack sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                    <FpForm/>
                </Stack>
            </Stack>
        </div>
    );
};

export default ForgotPassword;