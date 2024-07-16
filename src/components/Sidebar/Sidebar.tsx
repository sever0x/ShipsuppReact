import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import CatalogIcon from '@mui/icons-material/Category';
import OrdersIcon from '@mui/icons-material/ShoppingCart';
import ChatsIcon from '@mui/icons-material/Chat';
import ProfileIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import Typography from 'components/Typography';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Catalog', icon: <CatalogIcon />, path: `${pageURLs[pages.catalog]}` },
        { text: 'Orders', icon: <OrdersIcon />, path: `${pageURLs[pages.orders]}` },
        { text: 'Chats', icon: <ChatsIcon />, path: `${pageURLs[pages.chats]}` },
        { text: 'Profile', icon: <ProfileIcon />, path: `${pageURLs[pages.profile]}` },
    ];

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}
        >
            <Box sx={{
                height: 64,
                display: 'flex',
                position: 'relative',
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'opacity 0.2s, transform 0.2s',
                    opacity: 1,
                    transform: 'translateX(0)',
                    pb: 4,
                    pl: 2,
                }}>
                    <img src={'static/images/logo/minilogo.svg'} alt="Logo" style={{ width: '48px', height: '48px' }} />
                    <Typography bold={true} noWrap component="div" sx={{ color: '#231F20', fontSize: 24 }}>
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
                                disableRipple
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: '4px',
                                        right: '4px',
                                        top: '0',
                                        bottom: '0',
                                        backgroundColor: isActive ? 'primary.main' : 'transparent',
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
                                        padding: '8px 16px',
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 40,
                                            color: isActive ? 'text.primary' : 'inherit',
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
                                                color: isActive ? 'text.primary' : 'inherit',
                                                fontWeight: isActive ? 'bold' : 'medium',
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
};

export default Sidebar;