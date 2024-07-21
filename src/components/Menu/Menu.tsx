import React from 'react';
import { Menu as MuiMenu, MenuProps as MuiMenuProps } from '@mui/material';

interface CustomMenuProps extends Omit<MuiMenuProps, 'open'> {
    open: boolean;
}

const Menu: React.FC<CustomMenuProps> = ({
                                             children,
                                             open,
                                             sx,
                                             ...props
                                         }) => {
    return (
        <MuiMenu
            open={open}
            sx={{
                '& .MuiPaper-root': {
                    borderRadius: '8px',
                    boxShadow: 'none',
                    border: '1px solid #CCCCCC',
                    backgroundColor: '#FFFFFF',
                },
                ...sx
            }}
            {...props}
        >
            {children}
        </MuiMenu>
    );
};

export default Menu;