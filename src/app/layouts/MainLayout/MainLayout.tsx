import React from 'react';
import {
    CssBaseline,
    Drawer,
} from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import Box from 'components/Box';

const drawerWidth = 297;

const MainLayout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        transition: 'width 0.2s',
                        overflowX: 'hidden',
                        zIndex: 1200,
                        position: 'fixed',
                        height: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: 'background.default',
                        padding: '36px 24px',
                    },
                }}
            >
                <Sidebar />
            </Drawer>
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                marginLeft: `60px`,
                width: `calc(100% - 60px)`,
            }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;