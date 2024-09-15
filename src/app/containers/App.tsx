import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AuthProvider from "misc/providers/AuthProvider";
import ThemeProvider from 'misc/providers/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';
import ProtectedRoute from "../../pageProviders/components/ProtectedRoute";
import Profile from 'pages/profile';
import Catalog from 'pages/catalog';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import AuthLayout from "app/layouts/AuthLayout";
import MainLayout from "app/layouts/MainLayout";
import SignIn from "pages/login";
import Register from "pages/register";
import Orders from "pages/orders";
import NotFound from "pages/notFound";
import Chats from "pages/chats";
import SearchProvider from 'misc/providers/SearchProvider';

const RedirectToCatalog = () => <Navigate to={pageURLs[pages.catalog]} replace />;

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <SearchProvider>
                    <CssBaseline/>
                    <Router>
                        <Routes>
                            <Route element={<MainLayout/>}>
                                <Route path="/" element={<RedirectToCatalog />} />
                                <Route path={`${pageURLs[pages.home]}`} element={
                                    <ProtectedRoute>
                                        <Catalog/>
                                    </ProtectedRoute>
                                }/>
                                <Route path={`${pageURLs[pages.profile]}`} element={
                                    <ProtectedRoute>
                                        <Profile/>
                                    </ProtectedRoute>
                                }/>
                                <Route path={`${pageURLs[pages.catalog]}`} element={
                                    <ProtectedRoute>
                                        <Catalog/>
                                    </ProtectedRoute>
                                }/>
                                <Route path={`${pageURLs[pages.orders]}`} element={
                                    <ProtectedRoute>
                                        <Orders/>
                                    </ProtectedRoute>
                                }/>
                                <Route path={`${pageURLs[pages.chats]}`} element={
                                    <ProtectedRoute>
                                        <Chats/>
                                    </ProtectedRoute>
                                }/>
                                <Route path="*" element={<NotFound/>}/>
                            </Route>
                            <Route element={<AuthLayout/>}>
                                <Route path={`${pageURLs[pages.login]}`} element={
                                    <SignIn/>
                                }/>
                                <Route path={`${pageURLs[pages.register]}`} element={
                                    <Register/>
                                }/>
                            </Route>
                        </Routes>
                    </Router>
                </SearchProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;