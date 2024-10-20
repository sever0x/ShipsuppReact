import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {createUseStyles} from 'react-jss';
import useAuth from 'misc/hooks/useAuth';
import Typography from 'components/Typography';
import {Link} from "@mui/material";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import actions from "../../../../misc/actions/portsActions";
import EmailField from 'components/EmailField';
import PasswordField from 'components/PasswordField';
import TextField from 'components/TextField';
import SubmitButton from 'components/SubmitButton';
import {useSelector} from "react-redux";
import {RootState} from 'app/reducers';
import {useAppDispatch} from 'misc/hooks/useAppDispatch';
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

interface LocationState {
    step?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
}

const RegisterForm: React.FC = () => {
    const classes = getClasses();
    const { register, googleSignIn, updateProfile, user, error } = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const ports = useSelector((state: RootState) => state.ports.data);
    const location = useLocation();
    const state = location.state as LocationState;

    const [step, setStep] = useState(state?.step ?? 1);
    const [email, setEmail] = useState(state?.email ?? '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState(state?.firstName || '');
    const [lastName, setLastName] = useState(state?.lastName || '');
    const [phone, setPhone] = useState('');
    const [vesselIMO, setVesselIMO] = useState('');
    const [vesselMMSI, setVesselMMSI] = useState('');
    const [selectedPort, setSelectedPort] = useState<string>('');
    const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);

    useEffect(() => {
        dispatch(actions.fetchPorts());
    }, [dispatch]);

    useEffect(() => {
        if (state?.step) {
            setStep(state.step);
            setEmail(state.email || '');
            setFirstName(state.firstName || '');
            setLastName(state.lastName || '');
            setIsGoogleSignIn(true);
        }
    }, [state]);

    const handleNextStep = (event: React.FormEvent) => {
        event.preventDefault();
        if (step === 1 && password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setStep(step + 1);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const selectedPortObject = ports[selectedPort];
            if (isGoogleSignIn && user) {
                await updateProfile(user.uid, {
                    firstName,
                    lastName,
                    phone,
                    vesselIMO,
                    vesselMMSI,
                    portsArray: selectedPortObject ? [selectedPortObject] : []
                });
            } else {
                await register(email, password, {
                    firstName,
                    lastName,
                    phone,
                    vesselIMO,
                    vesselMMSI,
                    portsArray: selectedPortObject ? [selectedPortObject] : []
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('successfully submitted')) {
                    alert(error.message);
                    navigate('/login');
                } else {
                    console.error("Registration error:", error);
                }
            } else {
                console.error("Unknown error:", error);
            }
        }

    };

    const handleGoogleSignUp = async () => {
        try {
            const result = await googleSignIn();
            if (result.isNewUser) {
                alert('Thank you! Your request has been successfully submitted. We will contact you shortly.');
                navigate('/login');
            } else {
                navigate('/catalog');
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.message.includes('successfully submitted') || error.message.includes('please wait for confirmation')) {
                    alert(error.message);
                    navigate('/login');
                } else {
                    console.error("Google sign up error:", error);
                }
            } else {
                console.error("Unknown error:", error);
            }
        }
    };

    const handlePortSelect = (portId: string) => {
        setSelectedPort(portId);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <EmailField email={email} setEmail={setEmail} />
                        <PasswordField password={password} setPassword={setPassword} />
                        <PasswordField
                            password={confirmPassword}
                            setPassword={setConfirmPassword}
                            placeholder="Confirm Password"
                        />
                    </>
                );
            case 2:
                return (
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
                );
            case 3:
                return (
                    <>
                        {/*<TextField*/}
                        {/*    label="Vessel IMO"*/}
                        {/*    value={vesselIMO}*/}
                        {/*    onChange={(e) => setVesselIMO(e.target.value)}*/}
                        {/*/>*/}
                        {/*<TextField*/}
                        {/*    label="Vessel MMSI"*/}
                        {/*    value={vesselMMSI}*/}
                        {/*    onChange={(e) => setVesselMMSI(e.target.value)}*/}
                        {/*/>*/}
                        <div className={classes.portSelectorContainer}>
                            <PortSelector
                                ports={ports}
                                selectedPorts={selectedPort ? [selectedPort] : []}
                                onPortSelect={handlePortSelect}
                                multiSelect={false}
                                label="Select a port"
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <form onSubmit={step === 3 ? handleSubmit : handleNextStep}>
                <div className={classes.textContainer}>
                    <Typography sx={{fontSize: '2.25rem', fontWeight: 'bold'}}>
                        Sign Up
                    </Typography>
                    <Typography sx={{paddingTop: '16px'}}>
                        Already have an account? <Link href={`${pageURLs[pages.login]}`} sx={{
                        color: 'inherit',
                        textDecorationColor: 'inherit'
                    }}>Sign In</Link>
                    </Typography>
                </div>
                <div className={classes.fieldsContainer}>
                    {renderStep()}
                </div>
                {error && <Typography color="error">{error.message}</Typography>}
                <div className={classes.buttonsContainer}>
                    <SubmitButton text={step === 3 ? "Sign Up" : "Next"} />
                    {/*{step === 1 && !isGoogleSignIn && (*/}
                    {/*    <GoogleSignInButton onClick={handleGoogleSignUp} text="Sign Up with Google" />*/}
                    {/*)}*/}
                </div>
            </form>
        </>
    );
};

export default RegisterForm;