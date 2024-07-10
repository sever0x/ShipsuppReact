import React from 'react';
import { AppBar, Button, Container, CssBaseline, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';
import pageURLs from '../../../constants/pagesURLs';
import * as pages from '../../../constants/pages';
import { useSelector } from 'react-redux';
import {RootState} from "../../reducers";

const MainLayout: React.FC = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.userAuth);

    return (
        <div>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        ShipSupp Dev
                    </Typography>
                    {!isAuthenticated && (
                        <div>
                            <Button color="inherit" href={`${pageURLs[pages.login]}`}>
                                Sign In
                            </Button>
                            <Button color="inherit" href={`${pageURLs[pages.register]}`}>
                                Register
                            </Button>
                        </div>
                    )}
                    {isAuthenticated && (
                        <div>
                            <Button color="inherit" href={`${pageURLs[pages.catalog]}`}>
                                Catalog
                            </Button>
                            <Button color="inherit" href={`${pageURLs[pages.profile]}`}>
                                Profile
                            </Button>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Container>
                <Outlet />
            </Container>
        </div>
    );
};

export default MainLayout;
