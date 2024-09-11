import React, { useState } from 'react';
import { AppBar, CssBaseline, Drawer, IconButton, Theme, Toolbar, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import Box from 'components/Box';
import ProfileMenu from 'components/ProfileMenu';
import Typography from "../../../components/Typography";

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
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    backgroundColor: 'white',
                    boxShadow: 'none',
                    width: '100%',
                }}
            >
                <Toolbar
                    sx={{
                        justifyContent: 'space-between',
                        padding: { xs: '16px', md: '16px 36px !important' },
                        // minHeight: { xs: '64px', md: '88px !important' },
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(static/images/appbar-bg.png)`,
                        backgroundPosition: 'center',
                    }}
                >
                    {isMobile ? (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'opacity 0.2s, transform 0.2s',
                            opacity: 1,
                            transform: 'translateX(0)',
                            pl: 2,
                        }}>
                            <img src={'static/images/logo/minilogo.svg'} alt="Logo"
                                 style={{width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px'}}/>
                            <Typography bold={true} noWrap component="div"
                                        sx={{color: '#231F20', fontSize: isMobile ? 20 : 24}}>
                                ShipSupp
                            </Typography>
                        </Box>
                    )}
                    <ProfileMenu/>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { md: drawerWidth },
                    flexShrink: { md: 0 },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
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
                            zIndex: (theme) => theme.zIndex.drawer,
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