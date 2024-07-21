import React from 'react';
import { useNavigate } from 'react-router-dom';
import pageURLs from 'constants/pagesURLs';
import Box from 'components/Box';
import Typography from 'components/Typography';
import Button from 'components/Button';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ flexGrow: 3 }}
        >
            <Typography variant="h1" gutterBottom>
                404
            </Typography>
            <Typography variant="h5" gutterBottom>
                Oops! Page not found.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(pageURLs.catalog)}
                sx={{ mt: 2 }}
            >
                Go to Home
            </Button>
        </Box>
    );
};

export default NotFound;