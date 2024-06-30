import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
    typography: {
        fontFamily: 'Wix Madefor Display, sans-serif',
        caption: {
            fontSize: '12px',
            fontWeight: 400,
            letterSpacing: '0.03333em',
            lineHeight: 1.3,
        },
        body2: {
            fontSize: '14px',
            fontWeight: 400,
            letterSpacing: '0.03333em',
            lineHeight: 1.3,
        },
        body1: {
            fontSize: '16px',
            fontWeight: 400,
            letterSpacing: '0.03333em',
            lineHeight: 1.3,
        },
        h6: {
            fontSize: '20px',
            fontWeight: 400,
            letterSpacing: '0.03333em',
            lineHeight: 1.3,
        },
        h4: {
            fontSize: '36px',
            fontWeight: 600,
            letterSpacing: '0.03333em',
            lineHeight: 1.3,
        },
    },
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '4px',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                    },
                },
            },
        },
    },
});

export default muiTheme;