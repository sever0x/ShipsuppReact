import React from 'react';
import {ListItemText as MuiListItemText, ListItemTextProps as MuiListItemTextProps} from '@mui/material';

interface CustomListItemTextProps extends MuiListItemTextProps {
    bold?: boolean;
}

const ListItemText: React.FC<CustomListItemTextProps> = ({
                                                             bold = false,
                                                             primaryTypographyProps,
                                                             ...props
                                                         }) => {
    return (
        <MuiListItemText
            primaryTypographyProps={{
                fontWeight: bold ? 'bold' : undefined,
                ...primaryTypographyProps,
            }}
            {...props}
        />
    );
};

export default ListItemText;