import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {AppBar, Button, Container, CssBaseline, Toolbar, Typography} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import AuthProvider from "misc/providers/AuthProvider";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';

import SignIn from '../../components/SignIn/SignIn';
import Register from '../../components/Register/Register';
import Profile from '../../components/Profile/Profile';

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
                            <Button color="inherit" href={`${pageURLs[pages.login]}`}>
                                Sign In
                            </Button>
                            <Button color="inherit" href={`${pageURLs[pages.registration]}`}>
                                Register
                            </Button>
                            <Button color="inherit" href={`${pageURLs[pages.profile]}`}>
                                Profile
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Container>
                        <Routes>
                            <Route path={`${pageURLs[pages.home]}`} element={<Navigate to={`${pageURLs[pages.login]}`} />} />
                            <Route path={`${pageURLs[pages.login]}`} element={<SignIn />} />
                            <Route path={`${pageURLs[pages.registration]}`} element={<Register />} />
                            <Route path={`${pageURLs[pages.profile]}`} element={<Profile />} />
                        </Routes>
                    </Container>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
