import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import useAuth from 'misc/hooks/useAuth';
import Typography from "components/Typography";
import EmailField from '../EmailField';
import PasswordField from '../PasswordField';
import SubmitButton from '../SubmitButton';
import GoogleSignInButton from '../GoogleSignInButton';

const getClasses = createUseStyles(() => ({
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    fieldsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingTop: '64px'
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        paddingTop: '48px',
    },
}));

const SignInForm: React.FC = () => {
    const classes = getClasses();
    const { login, googleSignIn, error } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await login(email, password);
        navigate('/profile');
    };

    const handleGoogleSignIn = async () => {
        await googleSignIn();
        navigate('/profile');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={classes.textContainer}>
                <Typography sx={{ fontSize: '2.25rem', fontWeight: 'bold' }}>
                    Sign In.
                </Typography>
                <Typography sx={{ paddingTop: '16px' }}>
                    Don't have an account? Register
                </Typography>
            </div>
            <div className={classes.fieldsContainer}>
                <EmailField email={email} setEmail={setEmail} />
                <PasswordField password={password} setPassword={setPassword} />
            </div>
            {error && <Typography color="error">{error.message}</Typography>}
            <div className={classes.buttonsContainer}>
                <SubmitButton />
                <GoogleSignInButton onClick={handleGoogleSignIn} />
            </div>
        </form>
    );
};

export default SignInForm;