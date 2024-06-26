import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from "../../app/reducers";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.userAuth);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to={`${pageURLs[pages.login]}`} replace />;
};

export default ProtectedRoute;