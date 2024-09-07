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
}));

const RegisterForm: React.FC = () => {
    const classes = getClasses();
    const { register, googleSignIn, error } = useAuth();
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

    useEffect(() => {
        dispatch(actions.fetchPorts());
    }, [dispatch]);

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
            await register(email, password, {
                firstName,
                lastName,
                phone,
                vesselIMO,
                vesselMMSI,
                portsArray
            });
            navigate('/catalog');
        } catch (error) {
            console.error("Registration error:", error);
        }
    };

    const handleGoogleSignIn = async () => {
        await googleSignIn();
        navigate('/catalog');
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
                        <FormControl fullWidth className={classes.selectContainer}>
                            <InputLabel id="ports-select-label">Ports</InputLabel>
                            <Select
                                labelId="ports-select-label"
                                multiple
                                value={selectedPorts}
                                onChange={(e) => setSelectedPorts(e.target.value as string[])}
                                required
                            >
                                {Object.entries(ports).map(([id, port]: [string, any]) => (
                                    <MenuItem key={id} value={id}>
                                        {port.city.country.title} - {port.city.title} - {port.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={step === 3 ? handleSubmit : handleNextStep}>
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
    );
};

export default RegisterForm;