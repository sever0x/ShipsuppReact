import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {createUseStyles} from 'react-jss';
import useAuth from 'misc/hooks/useAuth';
import Typography from 'components/Typography';
import {FormControl, InputLabel, Link, Select} from "@mui/material";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import actions from "../../../../misc/actions/portsActions";
import EmailField from 'components/EmailField';
import PasswordField from 'components/PasswordField';
import TextField from 'components/TextField';
import SubmitButton from 'components/SubmitButton';
import GoogleSignInButton from 'components/GoogleSignInButton';
import {useSelector} from "react-redux";
import {RootState} from 'app/reducers';
import MenuItem from 'components/MenuItem';
import {useAppDispatch} from 'misc/hooks/useAppDispatch';
import PortSelector from 'components/PortSelector';
import SelectedPorts from 'components/SelectedPorts';
import Button from 'components/Button';
import {Visibility} from "@mui/icons-material";
import SelectedPortsModal from "components/SelectedPorts";

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
    selectContainer: {
        marginTop: '1rem',
        marginBottom: '1rem',
    },
    portSelectorContainer: {
        marginTop: '1rem',
        marginBottom: '1rem',
    },
    viewSelectedButton: {
        marginTop: '0.5rem',
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

const RegisterForm: React.FC = () => {
    const classes = getClasses();
    const { register, googleSignIn, updateProfile, user, error } = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const ports = useSelector((state: RootState) => state.ports.data);

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [vesselIMO, setVesselIMO] = useState('');
    const [vesselMMSI, setVesselMMSI] = useState('');
    const [selectedPorts, setSelectedPorts] = useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGoogleSignIn, setIsGoogleSignIn] = useState(false);

    useEffect(() => {
        dispatch(actions.fetchPorts());
    }, [dispatch]);

    useEffect(() => {
        if (user && isGoogleSignIn) {
            setEmail(user.email || '');
            if (user.displayName) {
                const nameParts = user.displayName.split(' ');
                setFirstName(nameParts[0] || '');
                setLastName(nameParts.slice(1).join(' ') || '');
            }
            setStep(3);  // Move to port selection step for Google users
        }
    }, [user, isGoogleSignIn]);

    const handleNextStep = (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        setStep(step + 1);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const portsArray = selectedPorts.map(portId => ports[portId]).filter(Boolean);
            if (isGoogleSignIn && user) {
                await updateProfile(user.uid, {
                    firstName,
                    lastName,
                    phone,
                    vesselIMO,
                    vesselMMSI,
                    portsArray
                });
            } else {
                await register(email, password, {
                    firstName,
                    lastName,
                    phone,
                    vesselIMO,
                    vesselMMSI,
                    portsArray
                });
            }
            navigate('/catalog');
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    const handlePortSelect = (portId: string) => {
        setSelectedPorts(prev => {
            if (prev.includes(portId)) {
                return prev.filter(id => id !== portId);
            } else {
                return [...prev, portId];
            }
        });
    };

    const handlePortRemove = (portId: string) => {
        setSelectedPorts(prev => prev.filter(id => id !== portId));
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleSignIn(true);
        try {
            await googleSignIn();
            // The user object will be updated in the Redux store,
            // triggering the useEffect above
        } catch (error) {
            console.error("Google sign-in error:", error);
        }
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
                        <TextField
                            label="Vessel IMO"
                            value={vesselIMO}
                            onChange={(e) => setVesselIMO(e.target.value)}
                        />
                        <TextField
                            label="Vessel MMSI"
                            value={vesselMMSI}
                            onChange={(e) => setVesselMMSI(e.target.value)}
                        />
                        <div className={classes.portSelectorContainer}>
                            <PortSelector
                                ports={ports}
                                selectedPorts={selectedPorts}
                                onPortSelect={handlePortSelect}
                            />
                            {selectedPorts.length > 0 && (
                                <div className={classes.viewSelectedButton}>
                                    <Button
                                        startIcon={<Visibility />}
                                        onClick={() => setIsModalOpen(true)}
                                        variant="text"
                                        size="small"
                                    >
                                        View Selected Ports ({selectedPorts.length})
                                    </Button>
                                </div>
                            )}
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
                    {step === 1 && (
                        <GoogleSignInButton onClick={handleGoogleSignIn} text="Sign Up with Google" />
                    )}
                </div>
            </form>
            <SelectedPortsModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedPorts={selectedPorts.map(id => ports[id]).filter(Boolean)}
                onRemove={handlePortRemove}
            />
        </>
    );
};

export default RegisterForm;