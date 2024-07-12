import React, { useState } from 'react';
import {
    Box,
    CssBaseline,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from '@mui/material';
import CatalogIcon from '@mui/icons-material/Category';
import OrdersIcon from '@mui/icons-material/ShoppingCart';
import ChatsIcon from '@mui/icons-material/Chat';
import ProfileIcon from '@mui/icons-material/Person';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../reducers';

const drawerWidth = 240;
const closedDrawerWidth = 60;

const MainLayout: React.FC = () => {
    const [open, setOpen] = useState(false);
    const { isAuthenticated } = useSelector((state: RootState) => state.userAuth);
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Catalog', icon: <CatalogIcon />, path: '/catalog' },
        { text: 'Orders', icon: <OrdersIcon />, path: '/orders' },
        { text: 'Chats', icon: <ChatsIcon />, path: '/chats' },
        { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
    ];

    const drawer = (
        <Box
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Box sx={{
                p: 2,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.2s, transform 0.2s',
                    opacity: open ? 1 : 0,
                    transform: open ? 'translateX(0)' : 'translateX(-20px)',
                }}>
                    <img src={'static/images/logo/minilogo.svg'} alt="Logo" style={{ width: '48px', height: '48px', marginRight: '8px' }} />
                    <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main' }}>
                        ShipSupp
                    </Typography>
                </Box>
                <Box sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'opacity 0.2s, transform 0.2s',
                    opacity: open ? 0 : 1,
                    transform: open ? 'translateX(20px)' : 'translateX(0)',
                }}>
                    <img src={'static/images/logo/minilogo.svg'} alt="Logo" style={{ width: '48px', height: '48px' }} />
                </Box>
            </Box>
            <List>
                {menuItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <ListItem
                            key={item.text}
                            disablePadding
                            sx={{
                                position: 'relative',
                            }}
                        >
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                sx={{
                                    px: 2,
                                    py: 1,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '8px',
                                        right: '8px',
                                        top: '4px',
                                        bottom: '4px',
                                        backgroundColor: isActive ? 'rgba(0, 230, 175, 0.15)' : 'transparent',
                                        borderRadius: '8px',
                                        transition: 'background-color 0.2s',
                                    }}
                                />
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        position: 'relative',
                                        zIndex: 1,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 40,
                                            color: isActive ? '#00E6AF' : 'inherit',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={item.text}
                                        sx={{
                                            opacity: open ? 1 : 0,
                                            transition: 'opacity 0.2s',
                                            '& .MuiListItemText-primary': {
                                                color: isActive ? '#00E6AF' : 'inherit',
                                                fontWeight: isActive ? 'bold' : 'normal',
                                            },
                                        }}
                                    />
                                </Box>
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                variant="permanent"
                sx={{
                    width: closedDrawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: open ? drawerWidth : closedDrawerWidth,
                        transition: 'width 0.2s',
                        overflowX: 'hidden',
                        zIndex: 1200,
                        position: 'fixed',
                        height: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: 'background.paper',
                    },
                }}
            >
                {drawer}
            </Drawer>
            <Box component="main" sx={{
                flexGrow: 1,
                p: 3,
                marginLeft: `${closedDrawerWidth}px`,
                width: `calc(100% - ${closedDrawerWidth}px)`,
            }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default MainLayout;