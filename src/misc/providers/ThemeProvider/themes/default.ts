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
            main: '#5BFEC5', // Bright mint green
        },
        secondary: {
            main: '#382F6D', // Deep purple
        },
        background: {
            default: '#FFFFFF', // White
            paper: '#DDF2EE', // Light cyan
        },
        text: {
            primary: '#102625', // Very dark teal (almost black)
            secondary: '#132F2F', // Dark teal
        },
        error: {
            main: '#463380', // Medium purple
        },
        warning: {
            main: '#5F4A9F', // Light purple
        },
        info: {
            main: '#EFFBF9', // Very light cyan
        },
        success: {
            main: '#194241', // Dark teal
        },
        grey: {
            100: '#FFFFFF', // White
            200: '#EFFBF9', // Very light cyan
            300: '#DDF2EE', // Light cyan
            400: '#C6D0D1', // Light grayish cyan
            500: '#ACB6B7', // Medium grayish cyan
            600: '#97A4A5', // Dark grayish cyan
        },
        // Add a custom red color
        customRed: {
            main: '#FF4D4F', // A bright red color
            dark: '#CC3E40', // A darker shade for hover effects
            light: '#FF7A7C', // A lighter shade if needed
            contrastText: '#FFFFFF', // White text for contrast
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
            variants: [
                {
                    props: { color: 'customRed' },
                    style: {
                        backgroundColor: '#FF4D4F',
                        color: '#FFFFFF',
                        '&:hover': {
                            backgroundColor: '#CC3E40',
                        },
                    },
                },
            ],
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
        MuiChip: {
            variants: [
                {
                    props: { color: 'customRed' },
                    style: {
                        backgroundColor: '#FF4D4F',
                        color: '#FFFFFF',
                        '&:hover': {
                            backgroundColor: '#CC3E40',
                        },
                    },
                },
            ],
        },
    },
});

declare module '@mui/material/styles' {
    interface Palette {
        customRed: Palette['primary'];
    }
    interface PaletteOptions {
        customRed?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        customRed: true;
    }
}

declare module '@mui/material/styles' {
    interface Palette {
        customRed: Palette['primary'];
    }
    interface PaletteOptions {
        customRed?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        customRed: true;
    }
}

declare module '@mui/material/Chip' {
    interface ChipPropsColorOverrides {
        customRed: true;
    }
}

export default muiTheme;