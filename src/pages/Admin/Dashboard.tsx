import { LayoutDashboard, Users, MessageCircle, Calendar, UserPlus, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAgo } from '../../services/scheduleService';
import styles from './Admin.module.css';

export default function Dashboard() {
  const { state } = useApp();
  
  const pendingQuestions = state.questions.filter(q => q.status === 'pending_review');
  
  const stats = [
    { 
      icon: MessageCircle, 
      value: state.questions.length, 
      label: 'Total Questions',
      color: 'var(--accent-violet)'
    },
    { 
      icon: Clock, 
      value: pendingQuestions.length, 
      label: 'Pending Answers',
      color: '#f59e0b'
    },
    { 
      icon: Calendar, 
      value: state.appointments.length, 
      label: 'Appointments',
      color: 'var(--accent-green)'
    },
    { 
      icon: UserPlus, 
      value: state.subscribers.length, 
      label: 'Subscribers',
      color: 'var(--primary-red)'
    },
  ];

  return (
    <div className="page-transition">
      <div className={styles.pageHeader}>
        <h1><LayoutDashboard size={28} /> Dashboard</h1>
        <span style={{ color: 'var(--text-gray)' }}>Welcome back, Admin</span>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={styles.statCard}>
              <div className={styles.statCardHeader}>
                <div className={styles.statCardIcon} style={{ background: stat.color }}>
                  <Icon size={20} />
                </div>
              </div>
              <div className={styles.statCardValue}>{stat.value}</div>
              <div className={styles.statCardLabel}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2><Clock size={20} /> Recent Pending Questions</h2>
        </div>
        
        {pendingQuestions.length > 0 ? (
          <div>
            {pendingQuestions.slice(0, 5).map((question) => (
              <div
                key={question.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.75rem',
                  borderLeft: '4px solid #f59e0b'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className={`${styles.badge} ${styles.pending}`}>Pending</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    {formatTimeAgo(question.createdAt)}
                  </span>
                </div>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', marginBottom: '8px' }}>
                  {question.text}
                </p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                  Category: {question.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MessageCircle size={48} />
            <p>No pending questions! 🎉</p>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2><Users size={20} /> Active Providers</h2>
        </div>
        
        {state.providers.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Specialty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.providers.map((provider) => (
                <tr key={provider.id}>
                  <td>
                    <strong>{provider.name}</strong>
                    <br />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      {provider.title}
                    </span>
                  </td>
                  <td>{provider.specialty}</td>
                  <td>
                    <span className={`${styles.badge} ${provider.acceptingPatients ? styles.success : styles.pending}`}>
                      {provider.acceptingPatients ? 'Accepting' : 'Not Accepting'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <Users size={48} />
            <p>No providers added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

