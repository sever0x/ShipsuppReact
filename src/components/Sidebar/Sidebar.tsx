import React, { useState, useEffect } from 'react';
import CatalogIcon from '@mui/icons-material/Category';
import OrdersIcon from '@mui/icons-material/ShoppingCart';
import ChatsIcon from '@mui/icons-material/Chat';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import SupportIcon from '@mui/icons-material/Help';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useLocation, useNavigate } from 'react-router-dom';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import Typography from 'components/Typography';
import Box from 'components/Box';
import List from 'components/List';
import ListItem from 'components/ListItem';
import ListItemButton from 'components/ListItemButton';
import ListItemIcon from 'components/ListItemIcon';
import ListItemText from 'components/ListItemText';
import Collapse from '@mui/material/Collapse';
import useAuth from 'misc/hooks/useAuth';

interface MenuItem {
    text: string;
    icon: React.ReactElement;
    path: string;
}

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { logout } = useAuth();

    const menuItems: MenuItem[] = [
        { text: 'Catalog', icon: <CatalogIcon />, path: `${pageURLs[pages.catalog]}` },
        { text: 'Orders', icon: <OrdersIcon />, path: `${pageURLs[pages.orders]}` },
        { text: 'Chats', icon: <ChatsIcon />, path: `${pageURLs[pages.chats]}` },
    ];

    const settingsItems: MenuItem[] = [
        { text: 'Permissions', icon: <LockIcon />, path: `${pageURLs[pages.permissions]}` },
        // Add more settings items here if needed
    ];

    const isSettingsActive = settingsItems.some(item => location.pathname.startsWith(item.path));

    useEffect(() => {
        if (isSettingsActive) {
            setSettingsOpen(true);
        } else {
            setSettingsOpen(false);
        }
    }, [location.pathname]);

    const handleSettingsClick = () => {
        setSettingsOpen(!settingsOpen);
    };

    const handleLogout = async () => {
        await logout();
        navigate(pageURLs[pages.login]);
    };

    const renderMenuItem = (item: MenuItem, isSubmenu: boolean = false) => {
        const isActive = location.pathname.startsWith(item.path);
        const showActive = isActive && (isSubmenu ? settingsOpen : true);

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
                            backgroundColor: showActive ? 'primary.main' : 'transparent',
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
                                color: showActive ? 'text.primary' : 'inherit',
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
                                    color: showActive ? 'text.primary' : 'inherit',
                                    fontWeight: showActive ? 'bold' : 'medium',
                                },
                            }}
                        />
                    </Box>
                </ListItemButton>
            </ListItem>
        );
    };

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
            <List sx={{ flexGrow: 1, overflow: 'auto' }}>
                {menuItems.map((item) => renderMenuItem(item))}

                {/* Settings dropdown */}
                <ListItem
                    disablePadding
                    sx={{
                        position: 'relative',
                    }}
                >
                    <ListItemButton
                        onClick={handleSettingsClick}
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
                                backgroundColor: isSettingsActive && !settingsOpen ? 'primary.main' : 'transparent',
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
                                    color: isSettingsActive && !settingsOpen ? 'text.primary' : 'inherit',
                                }}
                            >
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary="Settings"
                                sx={{
                                    opacity: 1,
                                    transition: 'opacity 0.2s',
                                    '& .MuiListItemText-primary': {
                                        color: isSettingsActive && !settingsOpen ? 'text.primary' : 'inherit',
                                        fontWeight: isSettingsActive && !settingsOpen ? 'bold' : 'medium',
                                    },
                                }}
                            />
                            {settingsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Box>
                    </ListItemButton>
                </ListItem>
                <Collapse in={settingsOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ maxHeight: 200, overflow: 'auto' }}>
                        {settingsItems.map((item) => renderMenuItem(item, true))}
                    </List>
                </Collapse>
            </List>

            {/* Bottom buttons */}
            <Box sx={{ mt: 'auto' }}>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={handleLogout}
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
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 1,
                                padding: '8px 16px',
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Logout" />
                        </Box>
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton
                        onClick={() => navigate(`/${pages.support}`)}
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
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 1,
                                padding: '8px 16px',
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                                <SupportIcon />
                            </ListItemIcon>
                            <ListItemText primary="Support" />
                        </Box>
                    </ListItemButton>
                </ListItem>
            </Box>
        </Box>
    );
};

export default Sidebar;