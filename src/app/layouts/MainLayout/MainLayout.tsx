import React from 'react';
import {
    AppBar,
    CssBaseline,
    Drawer,
    Toolbar,
} from '@mui/material';
import {Outlet} from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import Box from 'components/Box';
import ProfileMenu from 'components/ProfileMenu';

const drawerWidth = 297;

const MainLayout: React.FC = () => {
    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                }}
            >
                <Toolbar sx={{
                    justifyContent: 'flex-end',
                    padding: '24px 48px !important',
                    minHeight: '88px !important',
                }}>
                    <ProfileMenu/>
                </Toolbar>
            </AppBar>
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
                        padding: '24px 24px',
                    },
                }}
            >
                <Sidebar/>
            </Drawer>
            <Box component="main" sx={{
                display: `flex`,
                height: `100vh`,
                padding: `0 60px`,
                width: `calc(100% - 60px)`,
                marginTop: '88px',
            }}>
                <Box sx={{ flexGrow: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;