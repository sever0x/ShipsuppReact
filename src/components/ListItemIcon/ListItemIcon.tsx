import React from 'react';
import { ListItemIcon as MuiListItemIcon, ListItemIconProps as MuiListItemIconProps } from '@mui/material';

interface CustomListItemIconProps extends MuiListItemIconProps {
    size?: 'small' | 'medium' | 'large';
}

const ListItemIcon: React.FC<CustomListItemIconProps> = ({
                                                             children,
                                                             size = 'medium',
                                                             sx,
                                                             ...props
                                                         }) => {
    const sizeMap = {
        small: '20px',
        medium: '24px',
        large: '28px',
    };

    return (
        <MuiListItemIcon
            sx={{
                minWidth: sizeMap[size],
                '& > *': {
                    fontSize: sizeMap[size],
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </MuiListItemIcon>
    );
};

export default ListItemIcon;