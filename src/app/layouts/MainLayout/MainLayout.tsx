import React, {useState} from 'react';
import {AppBar, CssBaseline, Drawer, IconButton, Theme, Toolbar, useMediaQuery} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Outlet} from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import Box from 'components/Box';
import ProfileMenu from 'components/ProfileMenu';

const drawerWidth = 297;

const MainLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    zIndex: (theme) => theme.zIndex.drawer - 1,
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{
                    justifyContent: 'flex-end',
                    padding: { xs: '16px', md: '24px 64px !important' },
                    minHeight: { xs: '64px', md: '88px !important' },
                }}>
                    {isMobile && (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, ml: 1, display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}
                    <Box sx={{ flexGrow: 1 }} />
                    <ProfileMenu />
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                <Drawer
                    variant={isMobile ? 'temporary' : 'permanent'}
                    open={isMobile ? mobileOpen : true}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            transition: 'width 0.2s',
                            overflowX: 'hidden',
                            zIndex: 1300,
                            position: 'fixed',
                            height: '100%',
                            boxSizing: 'border-box',
                            backgroundColor: 'background.default',
                            padding: '24px',
                        },
                    }}
                >
                    <Sidebar />
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    padding: { xs: '16px', md: '0 60px' },
                    width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
                    marginTop: { xs: '64px', md: '98px' },
                    marginBottom: '24px',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default MainLayout;