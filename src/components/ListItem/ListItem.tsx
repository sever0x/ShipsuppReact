import React from 'react';
import { ListItem as MuiListItem, ListItemProps as MuiListItemProps } from '@mui/material';

interface CustomListItemProps extends MuiListItemProps {
    hoverable?: boolean;
}

const ListItem: React.FC<CustomListItemProps> = ({
                                                     children,
                                                     hoverable = false,
                                                     sx,
                                                     ...props
                                                 }) => {
    return (
        <MuiListItem
            sx={{
                transition: 'background-color 0.3s',
                '&:hover': hoverable ? {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                } : undefined,
                ...sx
            }}
            {...props}
        >
            {children}
        </MuiListItem>
    );
};

export default ListItem;