import React from 'react';
import { MenuItem as MuiMenuItem, MenuItemProps as MuiMenuItemProps } from '@mui/material';

interface CustomMenuItemProps extends MuiMenuItemProps {
    active?: boolean;
}

const MenuItem: React.FC<CustomMenuItemProps> = ({
                                                     children,
                                                     active = false,
                                                     sx,
                                                     ...props
                                                 }) => {
    return (
        <MuiMenuItem
            sx={{
                padding: '8px 16px',
                '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
                '&:not(:last-child)': {
                    borderBottom: '1px solid #EEEEEE',
                },
                ...(active && {
                    backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.12)',
                    },
                }),
                ...sx
            }}
            {...props}
        >
            {children}
        </MuiMenuItem>
    );
};

export default MenuItem;