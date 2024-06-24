import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import AuthProvider from './context/auth';
import SignIn from '../components/SignIn/SignIn';
import Register from '../components/Register/Register';
import Profile from '../components/Profile/Profile';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';

const theme = createTheme();

function App() {
    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Router>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" style={{ flexGrow: 1 }}>
                                Firebase Authentication
                            </Typography>
                            <Button color="inherit" href="/signin">
                                Sign In
                            </Button>
                            <Button color="inherit" href="/register">
                                Register
                            </Button>
                            <Button color="inherit" href="/profile">
                                Profile
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Container>
                        <Routes>
                            <Route path="/" element={<Navigate to="/signin" />} />
                            <Route path="/signin" element={<SignIn />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<PrivateRoute />}>
                                <Route path="" element={<Profile />} />
                            </Route>
                        </Routes>
                    </Container>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
