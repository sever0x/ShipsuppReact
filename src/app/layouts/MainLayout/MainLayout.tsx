import React, {useState} from 'react';
import {
    Box,
    CssBaseline,
    Drawer,
    IconButton,
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
import MenuIcon from '@mui/icons-material/Menu';
import {Outlet, useLocation, useNavigate} from 'react-router-dom';

const drawerWidth = 240;

const MainLayout: React.FC = () => {
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
                    opacity: 1,
                    transform: 'translateX(0)',
                }}>
                    <img src={'static/images/logo/minilogo.svg'} alt="Logo" style={{ width: '48px', height: '48px', marginRight: '8px' }} />
                    <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main' }}>
                        ShipSupp
                    </Typography>
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
                                            opacity: 1,
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
                        backgroundColor: 'background.paper',
                    },
                }}
            >
                {drawer}
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
