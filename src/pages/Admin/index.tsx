import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, MessageCircle, Radio, FileText, Video, Calendar, Menu, LogOut, ArrowLeft, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Dashboard from './Dashboard';
import ProvidersManage from './ProvidersManage';
import LocationsManage from './LocationsManage';
import QuestionsManage from './QuestionsManage';
import BroadcastsManage from './BroadcastsManage';
import ArticlesManage from './ArticlesManage';
import VideosManage from './VideosManage';
import AppointmentsView from './AppointmentsView';
import SubscribersView from './SubscribersView';
import styles from './Admin.module.css';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { path: '/admin/providers', icon: Users, label: 'Providers' },
  { path: '/admin/locations', icon: MapPin, label: 'Locations' },
  { path: '/admin/questions', icon: MessageCircle, label: 'Questions' },
  { path: '/admin/broadcasts', icon: Radio, label: 'Broadcasts' },
  { path: '/admin/articles', icon: FileText, label: 'Articles' },
  { path: '/admin/videos', icon: Video, label: 'Videos' },
  { path: '/admin/appointments', icon: Calendar, label: 'Bookings' },
];

export default function Admin() {
  const { state, actions } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  if (!state.isAdmin) return <LoginScreen onLogin={actions.login} />;

  return (
    <div className={styles.adminContainer}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.logoArea}>
          <h2>Admin<span className="gradient-text">Panel</span></h2>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link to="/" className={styles.navItem}><ArrowLeft size={20} /> Back to Site</Link>
          <button onClick={() => actions.logout()} className={styles.navItem}><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>
          <h3>Dashboard</h3>
          <div className={styles.userProfile}>Admin</div>
        </header>

        <div className={styles.contentArea}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/providers" element={<ProvidersManage />} />
            <Route path="/locations" element={<LocationsManage />} />
            <Route path="/questions" element={<QuestionsManage />} />
            <Route path="/broadcasts" element={<BroadcastsManage />} />
            <Route path="/articles" element={<ArticlesManage />} />
            <Route path="/videos" element={<VideosManage />} />
            <Route path="/appointments" element={<AppointmentsView />} />
            <Route path="/subscribers" element={<SubscribersView />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (e: string, p: string) => Promise<boolean> }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>Admin Access</h2>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} />
        <button onClick={() => onLogin(email, pass)}>Login</button>
        <p>Demo: admin@hillside.com / admin123</p>
      </div>
    </div>
  );
}
