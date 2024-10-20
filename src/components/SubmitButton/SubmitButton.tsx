import React from 'react';
import Button from "components/Button";

interface SubmitButtonProps {
    text: string,
    disabled?: boolean
}

const SubmitButton: React.FC<SubmitButtonProps> = ({text, disabled}) => (
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
        disabled={disabled ?? false}
    >
        {text}
    </Button>
);

export default SubmitButton;