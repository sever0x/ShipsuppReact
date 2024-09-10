import React from 'react';
import {SxProps, Theme, Typography as MuiTypography, TypographyProps} from "@mui/material";

interface CustomTypographyProps extends TypographyProps {
    bold?: boolean;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

const Typography: React.FC<CustomTypographyProps> = ({
    bold,
    color,
    sx,
    ...props
}) => {
    const customSx: SxProps<Theme> = {
        ...(bold && { fontWeight: 'bold' }),
        ...sx,
    };

    return <MuiTypography color={color} sx={customSx} {...props} />;
};

export default Typography;