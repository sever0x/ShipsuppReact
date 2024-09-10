import React from 'react';
import {ListItemButton as MuiListItemButton, ListItemButtonProps as MuiListItemButtonProps} from '@mui/material';

interface CustomListItemButtonProps extends MuiListItemButtonProps {
    activeColor?: string;
}

const ListItemButton: React.FC<CustomListItemButtonProps> = ({
                                                                 children,
                                                                 activeColor = '#e0e0e0',
                                                                 selected,
                                                                 sx,
                                                                 ...props
                                                             }) => {
    return (
        <MuiListItemButton
            selected={selected}
            sx={{
                '&.Mui-selected': {
                    backgroundColor: activeColor,
                    '&:hover': {
                        backgroundColor: activeColor,
                    },
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </MuiListItemButton>
    );
};

export default ListItemButton;