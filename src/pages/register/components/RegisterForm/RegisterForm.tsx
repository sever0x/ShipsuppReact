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
import TextField from 'components/TextField';
import SubmitButton from 'components/SubmitButton';
import GoogleSignInButton from 'components/GoogleSignInButton';

const getClasses = createUseStyles(() => ({
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

const RegisterForm: React.FC = () => {
    const classes = getClasses();
    const { register, googleSignIn, error } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');

    const handleNextStep = (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setStep(2);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await register(email, password, { firstName, lastName, phone });
            navigate('/catalog');
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        await googleSignIn();
        navigate('/catalog');
    };

    return (
        <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
            <div className={classes.textContainer}>
                <Typography sx={{ fontSize: '2.25rem', fontWeight: 'bold' }}>
                    Sign Up
                </Typography>
                <Typography sx={{ paddingTop: '16px' }}>
                    Already have an account? <Link href={`${pageURLs[pages.login]}`} sx={{
                    color: 'inherit',
                    textDecorationColor: 'inherit'
                }}>Sign In</Link>
                </Typography>
            </div>
            <div className={classes.fieldsContainer}>
                {step === 1 ? (
                    <>
                        <EmailField email={email} setEmail={setEmail} />
                        <PasswordField password={password} setPassword={setPassword} />
                        <PasswordField
                            password={confirmPassword}
                            setPassword={setConfirmPassword}
                            placeholder="Confirm Password"
                        />
                    </>
                ) : (
                    <>
                        <TextField
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </>
                )}
            </div>
            {error && <Typography color="error">{error.message}</Typography>}
            <div className={classes.buttonsContainer}>
                <SubmitButton text={step === 1 ? "Next" : "Sign Up"} />
                {step === 1 && (
                    <GoogleSignInButton onClick={handleGoogleSignIn} text="Sign Up with Google" />
                )}
            </div>
        </form>
    );
};

export default RegisterForm;