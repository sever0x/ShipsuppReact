import React, {useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {AppBar, Button, Container, CssBaseline, Toolbar, Typography} from '@mui/material';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import AuthProvider from "misc/providers/AuthProvider";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';

import SignIn from 'components/SignIn/SignIn';
import Register from 'components/Register/Register';
import Profile from 'components/Profile/Profile';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../reducers";
import ProtectedRoute from "../../pageProviders/components/ProtectedRoute";

const theme = createTheme();

function App() {
    const dispatch = useDispatch();
    const [state, setState] = useState({
        componentDidMount: false
    });

    const {
        error,
        user,
        isAuthenticated,
        isLoading
    } = useSelector((state: RootState) => state.userAuth);

    console.log(`App.tsx: userAuth ${isAuthenticated}`);

    return (
        <AuthProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {isLoading && (
                    <div>Loading...</div>
                )}
                {!isLoading && (
                    <Router>
                        <AppBar position="static">
                            <Toolbar>
                                <Typography variant="h6" style={{flexGrow: 1}}>
                                    Firebase Authentication
                                </Typography>
                                {!isAuthenticated && (
                                    <div>
                                        <Button color="inherit" href={`${pageURLs[pages.login]}`}>
                                            Sign In
                                        </Button>
                                        <Button color="inherit" href={`${pageURLs[pages.registration]}`}>
                                            Register
                                        </Button>
                                    </div>
                                )}
                                {isAuthenticated && (
                                    <Button color="inherit" href={`${pageURLs[pages.profile]}`}>
                                        Profile
                                    </Button>
                                )}
                            </Toolbar>
                        </AppBar>
                        <Container>
                            <Routes>
                                <Route path={`${pageURLs[pages.home]}`} element={
                                    <ProtectedRoute>
                                        <Profile/>
                                    </ProtectedRoute>
                                }/>
                                <Route path={`${pageURLs[pages.login]}`} element={
                                    <SignIn/>
                                }/>
                                <Route path={`${pageURLs[pages.registration]}`} element={
                                    <Register/>
                                }/>
                                <Route path={`${pageURLs[pages.profile]}`} element={
                                    <ProtectedRoute>
                                        <Profile/>
                                    </ProtectedRoute>
                                }/>
                            </Routes>
                        </Container>
                    </Router>
                )}
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
