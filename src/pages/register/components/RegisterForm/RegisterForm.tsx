import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createUseStyles } from 'react-jss';
import useAuth from 'misc/hooks/useAuth';
import Typography from 'components/Typography';
import { Link } from "@mui/material";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import actions from "../../../../misc/actions/portsActions";
import EmailField from 'components/EmailField';
import TextField from 'components/TextField';
import SubmitButton from 'components/SubmitButton';
import { useSelector } from "react-redux";
import { RootState } from 'app/reducers';
import { useAppDispatch } from 'misc/hooks/useAppDispatch';
import PortSelector from 'components/PortSelector';

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
    portSelectorContainer: {
        marginTop: '1rem',
        marginBottom: '1rem',
    },
}));

const RegisterForm: React.FC = () => {
    const classes = getClasses();
    const { register, updateProfile, user, error } = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const ports = useSelector((state: RootState) => state.ports.data);
    const location = useLocation();
    const state = location.state;

    const [email, setEmail] = useState(state?.email ?? '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState(state?.firstName || '');
    const [lastName, setLastName] = useState(state?.lastName || '');
    const [phone, setPhone] = useState('');
    const [referral, setReferral] = useState('');
    const [vesselIMO, setVesselIMO] = useState('');
    const [vesselMMSI, setVesselMMSI] = useState('');
    const [selectedPort, setSelectedPort] = useState<string>('');
    const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        dispatch(actions.fetchPorts());
    }, [dispatch]);

    useEffect(() => {
        if (state) {
            setEmail(state.email || '');
            setFirstName(state.firstName || '');
            setLastName(state.lastName || '');
            setIsGoogleSignIn(true);
        }
    }, [state]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        try {
            const selectedPortObject = ports[selectedPort];
            if (isGoogleSignIn && user) {
                await updateProfile(user.uid, {
                    firstName,
                    lastName,
                    phone,
                    vesselIMO,
                    vesselMMSI,
                    portsArray: selectedPortObject ? [selectedPortObject] : [],
                    referral
                });
            } else {
                await register(email, password, {
                    firstName,
                    lastName,
                    phone,
                    vesselIMO,
                    vesselMMSI,
                    portsArray: selectedPortObject ? [selectedPortObject] : [],
                    referral
                });
            }
            setSuccessMessage("Thank you! Your request has been successfully submitted. We will contact you shortly.");
        } catch (error) {
            if (error instanceof Error) {
                console.error("Registration error:", error);
            } else {
                console.error("Unknown error:", error);
            }
        }
    };

    const handlePortSelect = (portId: string) => {
        setSelectedPort(portId);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={classes.textContainer}>
                <Typography sx={{ fontSize: '2.25rem', fontWeight: 'bold' }}>
                    Become a partner
                </Typography>
                <Typography sx={{ paddingTop: '16px' }}>
                    Already have an account? <Link href={`${pageURLs[pages.login]}`} sx={{
                    color: 'inherit',
                    textDecorationColor: 'inherit'
                }}>Sign In</Link>
                </Typography>
            </div>
            <div className={classes.fieldsContainer}>
                <EmailField email={email} setEmail={setEmail} />
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
                <div className={classes.portSelectorContainer}>
                    <PortSelector
                        ports={ports}
                        selectedPorts={selectedPort ? [selectedPort] : []}
                        onPortSelect={handlePortSelect}
                        multiSelect={false}
                        label="Select a port"
                    />
                </div>
                <TextField
                    label="Referral code"
                    value={referral}
                    onChange={(e) => setReferral(e.target.value)}
                />
            </div>
            {error && <Typography color="error">{error.message}</Typography>}
            {successMessage && <Typography color="success">{successMessage}</Typography>}
            <div className={classes.buttonsContainer}>
                <SubmitButton text="Send request" />
            </div>
        </form>
    );
};

export default RegisterForm;
