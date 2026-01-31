import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { appTheme } from './theme';

// Pages
import Home from './pages/Home';
import Providers from './pages/Providers';
import Community from './pages/Community';
import Health from './pages/Health';
import Admin from './pages/Admin';
import About from './pages/About';
import Locations from './pages/Locations';

import ScrollToTop from './components/ScrollToTop';
import AppShell from './layouts/AppShell';
import AdminShell from './layouts/AdminShell';

// Loading component
function LoadingScreen() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <img 
        src="https://hillsidemedicalgroup.com/wp-content/uploads/elementor/thumbs/logo-qjcyatp8t2zdgruz5lh3bvqjn1bavuh6aw0vr1nrzw.png" 
        alt="Loading..."
        style={{ height: '50px', marginBottom: '1.5rem' }}
      />
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e2e8f0',
        borderTopColor: '#8b5cf6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function AppContent() {
  const { state } = useApp();

  if (state.loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public app shell (Material UI) */}
          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/providers" element={<Providers />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/community" element={<Community />} />
            <Route path="/health" element={<Health />} />
            <Route path="/health/:categoryId" element={<Health />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Admin (no public header/footer/footer) */}
          <Route element={<AdminShell />}>
            <Route path="/admin/*" element={<Admin />} />
          </Route>
        </Routes>

        <Toaster position="top-right" />
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
