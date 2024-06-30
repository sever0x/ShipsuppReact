import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import AuthProvider from "misc/providers/AuthProvider";
import ThemeProvider from 'misc/providers/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from "../../pageProviders/components/ProtectedRoute";
import Profile from 'components/Profile/Profile';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import AuthLayout from "app/layouts/AuthLayout";
import MainLayout from "app/layouts/MainLayout";
import SignIn from "pages/login/containers/SignIn";
import Register from "pages/register/containers/Register";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route element={<MainLayout />}>
                            <Route path={`${pageURLs[pages.home]}`} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                            <Route path={`${pageURLs[pages.profile]}`} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                        </Route>
                        <Route element={<AuthLayout />}>
                            <Route path={`${pageURLs[pages.login]}`} element={<SignIn />} />
                            <Route path={`${pageURLs[pages.register]}`} element={<Register />} />
                        </Route>
                    </Routes>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
