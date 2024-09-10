import React, {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {RootState} from "../../app/reducers";
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import {CircularProgress} from "@mui/material";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.userAuth);

    if (isLoading) {
        return <CircularProgress />;
    }

    return isAuthenticated ? <>{children}</> : <Navigate to={`${pageURLs[pages.login]}`} replace />;
};

export default ProtectedRoute;