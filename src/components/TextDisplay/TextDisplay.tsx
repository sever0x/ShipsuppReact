import Box from 'components/Box';
import Typography from 'components/Typography';
import React, {ReactNode} from 'react';

interface TextDisplayProps {
    label: string;
    value: string | number | null | undefined | ReactNode;
}

const TextDisplay: React.FC<TextDisplayProps> = ({ label, value }) => (
    <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="secondary" gutterBottom>
            {label}
        </Typography>
        <Typography variant="body1">
            {value || '-'}
        </Typography>
    </Box>
);

export default TextDisplay;