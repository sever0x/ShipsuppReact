import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Button, Container, Divider, TextField, Typography} from '@mui/material';
import useAuth from 'misc/hooks/useAuth';
import {Google} from "@mui/icons-material";

const SignIn = () => {
    const { login, googleSignIn, error } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

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
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>Sign In</Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <Typography color="error">{error.message}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Sign In
                </Button>
            </form>
            <Divider style={{ margin: '20px 0' }}>OR</Divider>
            <Button
                onClick={handleGoogleSignIn}
                variant="outlined"
                color="primary"
                fullWidth
                startIcon={<Google />}
            >
                Sign In with Google
            </Button>
        </Container>
    );
};

export default SignIn;