import React from 'react';
import { List as MuiList, ListProps as MuiListProps } from '@mui/material';

interface CustomListProps extends MuiListProps {
    spacing?: number | null;
}

const List: React.FC<CustomListProps> = ({
                                             children,
                                             spacing = null,
                                             sx,
                                             ...props
                                         }) => {
    return (
        <MuiList
            sx={{
                ...(spacing !== null && {
                    '& > *:not(:last-child)': {
                        marginBottom: `${spacing * 8}px`,
                    },
                }),
                ...sx
            }}
            {...props}
        >
            {children}
        </MuiList>
    );
};

export default List;