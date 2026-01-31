import { createTheme } from '@mui/material/styles';

// Dark mode removed (per your request). Single theme that matches Hillside brand.
export const appTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#8a0b0b' },
    secondary: { main: '#8b5cf6' },
    background: { default: '#f3f4f6', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: `'Plus Jakarta Sans', Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`,
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 800 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});


