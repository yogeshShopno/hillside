import { useMemo, useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  Badge,
  IconButton,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ForumIcon from '@mui/icons-material/Forum';
import FavoriteIcon from '@mui/icons-material/Favorite';
import InfoIcon from '@mui/icons-material/Info';
import PlaceIcon from '@mui/icons-material/Place';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { AnimatePresence, motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { formatTimeAgo } from '../services/scheduleService';

const LOGO_URL =
  'https://hillsidemedicalgroup.com/wp-content/uploads/elementor/thumbs/logo-qjcyatp8t2zdgruz5lh3bvqjn1bavuh6aw0vr1nrzw.png';

const nav = [
  { to: '/', label: 'Home' },
  { to: '/providers', label: 'Providers' },
  { to: '/locations', label: 'Locations' },
  { to: '/community', label: 'Community' },
  { to: '/health', label: 'Health' },
  { to: '/about', label: 'About' },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'announcement': return <AnnouncementIcon fontSize="small" sx={{ color: '#3b82f6' }} />;
    case 'health': return <HealthAndSafetyIcon fontSize="small" sx={{ color: '#10b981' }} />;
    case 'reminder': return <AccessTimeIcon fontSize="small" sx={{ color: '#f59e0b' }} />;
    case 'promotion': return <CelebrationIcon fontSize="small" sx={{ color: '#8b5cf6' }} />;
    default: return <AnnouncementIcon fontSize="small" sx={{ color: '#64748b' }} />;
  }
};

export default function AppShell() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state, actions } = useApp();
  
  // Notification popover state
  const [notifAnchor, setNotifAnchor] = useState<HTMLButtonElement | null>(null);
  const notifOpen = Boolean(notifAnchor);

  // Get unread notifications count
  const unreadCount = state.notifications?.filter(n => !n.read).length || 0;

  const handleNotifClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setNotifAnchor(event.currentTarget);
  };

  const handleNotifClose = () => {
    setNotifAnchor(null);
  };

  const handleMarkAllRead = () => {
    actions.markAllNotificationsRead();
    handleNotifClose();
  };

  const bottomValue = useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/providers')) return '/providers';
    if (path.startsWith('/locations')) return '/locations';
    if (path.startsWith('/community')) return '/community';
    if (path.startsWith('/health')) return '/health';
    if (path.startsWith('/about')) return '/about';
    return '/';
  }, [location.pathname]);

  return (
    <Box sx={{ minHeight: '100vh', pb: isMobile ? '76px' : 0 }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Toolbar>
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: 'inherit' }}
          >
            <Box component="img" src={LOGO_URL} alt="Hillside Medical" sx={{ height: 34 }} />
          </Box>

          <Box sx={{ flex: 1 }} />

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              {nav.map((item) => {
                const isActive = location.pathname === item.to || 
                  (item.to !== '/' && location.pathname.startsWith(item.to));
                return (
                  <Button
                    key={item.to}
                    component={RouterLink}
                    to={item.to}
                    sx={{
                      color: isActive ? 'primary.main' : 'text.primary',
                      fontWeight: isActive ? 700 : 500,
                      position: 'relative',
                      '&::after': isActive ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 6,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '20px',
                        height: '3px',
                        bgcolor: 'primary.main',
                        borderRadius: '2px',
                      } : {},
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.04)',
                        color: 'primary.main',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
              
              {/* Notification Bell */}
              <IconButton
                onClick={handleNotifClick}
                sx={{ 
                  ml: 1,
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
              >
                <Badge 
                  badgeContent={unreadCount} 
                  color="error"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.7rem',
                      minWidth: '18px',
                      height: '18px',
                    }
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              {/* Notification Popover */}
              <Popover
                open={notifOpen}
                anchorEl={notifAnchor}
                onClose={handleNotifClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    width: 360,
                    maxHeight: 420,
                    borderRadius: 3,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    overflow: 'hidden',
                  }
                }}
              >
                <Box sx={{ 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'rgba(0,0,0,0.02)'
                }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </Typography>
                  {unreadCount > 0 && (
                    <Button size="small" onClick={handleMarkAllRead} sx={{ fontSize: '0.75rem' }}>
                      Mark all read
                    </Button>
                  )}
                </Box>
                
                {state.notifications && state.notifications.length > 0 ? (
                  <List sx={{ p: 0, maxHeight: 340, overflow: 'auto' }}>
                    {state.notifications.slice(0, 10).map((notif, idx) => (
                      <Box key={notif.id}>
                        <ListItem
                          sx={{
                            py: 1.5,
                            px: 2,
                            bgcolor: notif.read ? 'transparent' : 'rgba(139, 92, 246, 0.06)',
                            '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {getNotificationIcon(notif.type)}
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" fontWeight={notif.read ? 400 : 600}>
                                {notif.title}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  {notif.message.length > 60 ? notif.message.slice(0, 60) + '...' : notif.message}
                                </Typography>
                                <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.7rem' }}>
                                  {formatTimeAgo(notif.createdAt)}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {idx < state.notifications.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                ) : (
                  <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                    <NotificationsIcon sx={{ fontSize: 40, mb: 1, opacity: 0.3 }} />
                    <Typography variant="body2">No notifications yet</Typography>
                  </Box>
                )}
              </Popover>
              
              {/* Ask a question button */}
              <Button
                component={RouterLink}
                to="/community"
                variant="outlined"
                startIcon={<QuestionAnswerIcon />}
                sx={{ borderRadius: 999, ml: 1 }}
              >
                Ask a question
              </Button>
            </Box>
          )}
          
          {/* Mobile notification bell */}
          {isMobile && (
            <IconButton
              onClick={handleNotifClick}
              sx={{ color: 'text.secondary' }}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Container>

      {isMobile && (
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 14,
            px: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 520,
              borderRadius: 999,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(14px)',
              boxShadow: '0 20px 50px rgba(15,23,42,0.12)',
              overflow: 'hidden',
            }}
          >
            <BottomNavigation showLabels value={bottomValue} sx={{ height: 66 }}>
              <BottomNavigationAction component={RouterLink} to="/" value="/" label="Home" icon={<HomeIcon />} />
              <BottomNavigationAction
                component={RouterLink}
                to="/providers"
                value="/providers"
                label="Providers"
                icon={<LocalHospitalIcon />}
              />
              <BottomNavigationAction
                component={RouterLink}
                to="/locations"
                value="/locations"
                label="Locations"
                icon={<PlaceIcon />}
              />
              <BottomNavigationAction
                component={RouterLink}
                to="/community"
                value="/community"
                label="Community"
                icon={<ForumIcon />}
              />
              <BottomNavigationAction component={RouterLink} to="/health" value="/health" label="Health" icon={<FavoriteIcon />} />
              <BottomNavigationAction component={RouterLink} to="/about" value="/about" label="About" icon={<InfoIcon />} />
            </BottomNavigation>
          </Box>
        </Box>
      )}
    </Box>
  );
}


