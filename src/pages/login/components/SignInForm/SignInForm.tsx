import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {createUseStyles} from "react-jss";
import useAuth from 'misc/hooks/useAuth';
import Typography from "components/Typography";
import EmailField from 'components/EmailField';
import PasswordField from 'components/PasswordField';
import SubmitButton from 'components/SubmitButton';
import GoogleSignInButton from 'components/GoogleSignInButton';
import {Link} from "@mui/material";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';

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

const SignInForm: React.FC = () => {
    const classes = getClasses();
    const {login, googleSignIn, error} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        await login(email, password);
        navigate('/catalog');
    };

    const handleGoogleSignIn = async () => {
        await googleSignIn();
        navigate('/catalog');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={classes.textContainer}>
                <Typography sx={{fontSize: '2.25rem', fontWeight: 'bold'}}>
                    Sign In.
                </Typography>
                <Typography sx={{paddingTop: '16px'}}>
                    Don't have an account? <Link href={`${pageURLs[pages.register]}`} sx={{
                    color: 'inherit',
                    textDecorationColor: 'inherit'
                }}
                >
                    Register
                </Link>
                </Typography>
            </div>
            <div className={classes.fieldsContainer}>
                <EmailField email={email} setEmail={setEmail}/>
                <PasswordField password={password} setPassword={setPassword}/>
            </div>
            {error && <Typography color="error">{error.message}</Typography>}
            <div className={classes.buttonsContainer}>
                <SubmitButton text="Sign In"/>
                <GoogleSignInButton onClick={handleGoogleSignIn} text="Sign In with Google"/>
            </div>
        </form>
    );
};

export default SignInForm;