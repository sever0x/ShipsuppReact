import React from 'react';
import Button from "components/Button";

interface SubmitButtonProps {
    text: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ text }) => (
    <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{
            backgroundColor: '#000',
            color: '#fff',
            borderRadius: '16px',
            textTransform: 'none',
            padding: '10px 0',
            '&:hover': {
                backgroundColor: '#333',
            },
        }}
    >
        {text}
    </Button>
);

export default SubmitButton;