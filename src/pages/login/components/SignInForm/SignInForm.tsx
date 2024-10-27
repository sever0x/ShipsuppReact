import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { createUseStyles } from "react-jss";
import useAuth from 'misc/hooks/useAuth';
import Typography from "components/Typography";
import EmailField from 'components/EmailField';
import PasswordField from 'components/PasswordField';
import SubmitButton from 'components/SubmitButton';
import GoogleSignIn from 'components/GoogleSignIn';
import { Link } from "@mui/material";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import actions from '../../../../app/actions/userAuth';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../misc/hooks/useAppDispatch";

const getClasses = createUseStyles(() => ({
    container: {
        height: '100vh',
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
    },
    textContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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

interface SignInFormProps {
    onError: (errorMessage: string) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({ onError }) => {
    const classes = getClasses();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await dispatch(actions.fetchLogin(email, password));
            navigate('/catalog');
        } catch (err: any) {
            onError(err.message || 'An error occurred during sign in.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className={classes.textContainer}>
                <Typography sx={{ fontSize: '2.25rem', fontWeight: 'bold' }}>
                    Sign In
                </Typography>
                <Typography sx={{ paddingTop: '16px' }}>
                    Don't have an account? <Link href={`${pageURLs[pages.register]}`} sx={{
                    color: 'inherit',
                    textDecorationColor: 'inherit'
                }}>
                    Register
                </Link>
                </Typography>
            </div>
            <div className={classes.fieldsContainer}>
                <EmailField email={email} setEmail={setEmail} />
                <PasswordField password={password} setPassword={setPassword} />
            </div>
            <Typography sx={{ paddingTop: '16px', display: "flex", justifyContent: "flex-end" }}>
                <Link href={`${pageURLs[pages.forgotPassword]}`} sx={{
                    color: 'inherit',
                    textDecorationColor: 'inherit'
                }}>
                    Forgot password?
                </Link>
            </Typography>
            <div className={classes.buttonsContainer}>
                <SubmitButton text="Sign In" disabled={isSubmitting} />
                <GoogleSignIn onError={onError} />
            </div>
        </form>
    );
};

export default SignInForm;