import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../misc/hooks/useAuth';

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
