import React, {useState} from 'react';
import Typography from "../../../components/Typography";
import EmailField from "../../../components/EmailField";
import SubmitButton from "../../../components/SubmitButton";
import {createUseStyles} from "react-jss";
import actions from "../../../app/actions/userAuth";
import {Link} from "@mui/material";
import pageURLs from "../../../constants/pagesURLs";
import * as pages from "../../../constants/pages";
import {useDispatch} from 'react-redux';
import {Alert} from '@mui/material';
import {useAppDispatch} from "../../../misc/hooks/useAppDispatch";

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
    alert: {
        marginTop: '1rem'
    }
}));

const FpForm = () => {
    const classes = getClasses();
    const dispatch = useAppDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<{
        type: 'success' | 'error' | null;
        message: string;
    }>({ type: null, message: '' });

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        setStatus({ type: null, message: '' });

        try {
            await dispatch(actions.fetchPasswordReset(email));
            setStatus({
                type: 'success',
                message: 'Password reset link has been sent to your email'
            });
            setEmail('');
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.message || 'Failed to send reset link. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} noValidate>
                <div className={classes.textContainer}>
                    <Typography sx={{fontSize: '2.25rem', fontWeight: 'bold'}}>
                        Reset password
                    </Typography>
                    <Typography sx={{ paddingTop: '16px' }}>
                        Enter your email and we will send you a recovery link
                    </Typography>
                </div>

                {status.type && (
                    <Alert
                        severity={status.type}
                        className={classes.alert}
                        onClose={() => setStatus({ type: null, message: '' })}
                    >
                        {status.message}
                    </Alert>
                )}

                <div className={classes.fieldsContainer}>
                    <EmailField
                        email={email}
                        setEmail={setEmail}
                    />
                </div>
                <div className={classes.buttonsContainer}>
                    <SubmitButton
                        text={isSubmitting ? "Sending..." : "Reset password"}
                        disabled={isSubmitting || !email}
                    />
                </div>
            </form>
        </div>
    );
};

export default FpForm;