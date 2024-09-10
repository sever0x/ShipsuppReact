import React from 'react';
import {Stack as MuiStack, StackProps, SxProps, Theme} from "@mui/material";

interface CustomStackProps extends StackProps {
    fullHeight?: boolean;
    fullWidth?: boolean;
    centered?: boolean;
}

const Stack: React.FC<CustomStackProps> = ({
    fullHeight,
    fullWidth,
    centered,
    sx,
    ...props
}) => {
    const customSx: SxProps<Theme> = {
        ...(fullHeight && { height: '100%' }),
        ...(fullWidth && { width: '100%' }),
        ...(centered && {
            justifyContent: 'center',
            alignItems: 'center'
        }),
        ...sx,
    };

    return <MuiStack sx={customSx} {...props} />;
};

export default Stack;