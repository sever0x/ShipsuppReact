import React, { useState, useEffect } from 'react';
import { Avatar, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useAuth from 'misc/hooks/useAuth';
import pageURLs from 'constants/pagesURLs';
import * as pages from 'constants/pages';
import Box from 'components/Box';
import IconButton from "../IconButton";
import {MoreVert} from "@mui/icons-material";
import Typography from 'components/Typography';
import Menu from 'components/Menu';
import MenuItem from 'components/MenuItem';
import storage from 'misc/storage';

const ProfileMenu: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [userData, setUserData] = useState<{ firstName: string; lastName: string; profilePhoto: string } | null>(null);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    useEffect(() => {
        const loadUserData = () => {
            const storedUserData = storage.getItem('USER_DATA');
            if (storedUserData) {
                setUserData(JSON.parse(storedUserData));
            }
        };

        loadUserData();
        const intervalId = setInterval(loadUserData, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMyProfile = () => {
        navigate(pageURLs[pages.profile]);
        handleClose();
    };

    const handleLogout = async () => {
        await logout();
        navigate(pageURLs[pages.login]);
        handleClose();
    };

    const renderContent = () => {
        if (!userData) {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={100} height={20} />
                    <Skeleton variant="circular" width={24} height={24} />
                </Box>
            );
        }

        const { firstName, lastName, profilePhoto } = userData;

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar src={profilePhoto} alt={`${firstName} ${lastName}`} sx={{ width: 40, height: 40, mr: 1 }} />
                <Typography variant="subtitle1">{`${firstName} ${lastName}`}</Typography>
                <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={open ? 'long-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={handleOpen}
                >
                    <MoreVert />
                </IconButton>
            </Box>
        );
    };

    return (
        <Box>
            {renderContent()}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleMyProfile}>My Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
};

export default ProfileMenu;