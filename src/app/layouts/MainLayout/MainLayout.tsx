import React, { useState } from 'react';
import { AppBar, CssBaseline, Drawer, IconButton, Theme, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from 'components/Sidebar';
import Box from 'components/Box';
import ProfileMenu from 'components/ProfileMenu';
import Typography from "../../../components/Typography";
import GlobalSearch from 'components/GlobalSearch';
import pageURLs from 'constants/pagesURLs';

const drawerWidth = 297;

const MainLayout: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    const isMediumDevice = useMediaQuery(theme.breakpoints.between('md', 'lg'));
    const isSmallScreen = isMobile || isTablet || isMediumDevice;
    const location = useLocation();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const toggleSearch = () => {
        setSearchExpanded(!searchExpanded);
    };

    const isSearchVisible = [pageURLs.catalog, pageURLs.orders].includes(location.pathname);

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
                        padding: { xs: '8px', sm: '16px', md: '16px 36px !important' },
                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(static/images/appbar-bg.png)`,
                        backgroundPosition: 'center',
                    }}
                >
                    {isSmallScreen ? (
                        isMobile && isSearchVisible && searchExpanded ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <IconButton onClick={toggleSearch}>
                                    <ArrowBackIcon />
                                </IconButton>
                                <GlobalSearch expanded={true} />
                            </Box>
                        ) : (
                            <>
                                <IconButton
                                    color="inherit"
                                    aria-label="open drawer"
                                    edge="start"
                                    onClick={handleDrawerToggle}
                                    sx={{ mr: 2 }}
                                >
                                    <MenuIcon />
                                </IconButton>
                                {isSearchVisible && isMobile && (
                                    <IconButton onClick={toggleSearch}>
                                        <SearchIcon />
                                    </IconButton>
                                )}
                                {(isTablet || isMediumDevice) && isSearchVisible && (
                                    <GlobalSearch />
                                )}
                            </>
                        )
                    ) : (
                        <>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'opacity 0.2s, transform 0.2s',
                                opacity: 1,
                                transform: 'translateX(0)',
                                pl: 2,
                            }}>
                                <img src={'static/images/logo/minilogo.svg'} alt="Logo"
                                     style={{width: '48px', height: '48px'}}/>
                                <Typography bold={true} noWrap component="div"
                                            sx={{color: '#231F20', fontSize: 24, ml: 1}}>
                                    ShipSupp
                                </Typography>
                            </Box>
                            {isSearchVisible && <GlobalSearch />}
                        </>
                    )}
                    {(!isMobile || !searchExpanded) && <ProfileMenu />}
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { lg: drawerWidth },
                    flexShrink: { lg: 0 },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Drawer
                    variant={isSmallScreen ? 'temporary' : 'permanent'}
                    open={isSmallScreen ? mobileOpen : true}
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
                    padding: { xs: '16px', lg: '0 60px' },
                    width: { xs: '100%', lg: `calc(100% - ${drawerWidth}px)` },
                    marginTop: { xs: '56px', sm: '64px', md: '98px' },
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