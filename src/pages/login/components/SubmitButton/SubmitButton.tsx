import Button from 'components/Button';
import React from 'react';

const SubmitButton: React.FC = () => (
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
        Sign In
    </Button>
);

export default SubmitButton;