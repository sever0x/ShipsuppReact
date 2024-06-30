import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import useAuth from 'misc/hooks/useAuth';
import Typography from 'components/Typography';
import { Link } from "@mui/material";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import EmailField from 'components/EmailField';
import PasswordField from 'components/PasswordField';
import SubmitButton from 'components/SubmitButton';
import GoogleSignInButton from 'components/GoogleSignInButton';

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

const RegisterForm: React.FC = () => {
    const classes = getClasses();
    const { register, googleSignIn, error } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        await register(email, password);
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
                    Sign Up.
                </Typography>
                <Typography sx={{ paddingTop: '16px' }}>
                    Already have an account? <Link href={`${pageURLs[pages.login]}`}>Sign In</Link>
                </Typography>
            </div>
            <div className={classes.fieldsContainer}>
                <EmailField email={email} setEmail={setEmail} />
                <PasswordField password={password} setPassword={setPassword} />
                <PasswordField
                    password={confirmPassword}
                    setPassword={setConfirmPassword}
                    placeholder="Confirm Password"
                />
            </div>
            {error && <Typography color="error">{error.message}</Typography>}
            <div className={classes.buttonsContainer}>
                <SubmitButton text="Sign Up" />
                <GoogleSignInButton onClick={handleGoogleSignIn} text="Sign Up with Google" />
            </div>
        </form>
    );
};

export default RegisterForm;