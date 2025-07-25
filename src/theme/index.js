import { createTheme } from '@mui/material/styles';
import { red, blue, green, grey } from '@mui/material/colors';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196f3',
            light: '#64b5f6',
            dark: '#1976d2',
        },
        secondary: {
            main: '#f50057',
            light: '#ff4081',
            dark: '#c51162',
        },
        error: {
            main: red.A400,
        },
        warning: {
            main: '#ff9800',
        },
        info: {
            main: '#2196f3',
        },
        success: {
            main: green.A400,
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Helvetica',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
            color: '#333',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
            color: '#444',
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500,
            color: '#555',
        },
        body1: {
            fontSize: '1rem',
            color: '#666',
        },
        button: {
            textTransform: 'none',
            fontWeight: 500,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 24px',
                },
                containedPrimary: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },
        MuiTable: {
            styleOverrides: {
                root: {
                    minWidth: 650,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: '1px solid rgba(224, 224, 224, 1)',
                },
            },
        },
    },
    shape: {
        borderRadius: 8,
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 960,
            lg: 1280,
            xl: 1920,
        },
    },
});

export default theme;
