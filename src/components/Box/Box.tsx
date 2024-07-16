import React from 'react';
import { Box as MuiBox, BoxProps as MuiBoxProps } from '@mui/material';

interface CustomBoxProps extends MuiBoxProps {
    padded?: boolean;
    rounded?: boolean;
}

const Box: React.FC<CustomBoxProps> = ({
                                           children,
                                           padded = false,
                                           rounded = false,
                                           sx,
                                           ...props
                                       }) => {
    return (
        <MuiBox
            sx={{
                padding: padded ? '16px' : undefined,
                borderRadius: rounded ? '8px' : undefined,
                ...sx
            }}
            {...props}
        >
            {children}
        </MuiBox>
    );
};

export default Box;