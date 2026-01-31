import { useState } from 'react';
import { Radio, Send, Megaphone, Syringe, Clock, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAgo } from '../../services/scheduleService';
import toast from 'react-hot-toast';
import styles from './Admin.module.css';

const broadcastTypes = [
  { value: 'announcement', label: '📢 Announcement', icon: 'Megaphone' },
  { value: 'health', label: '💉 Health Update', icon: 'Syringe' },
  { value: 'reminder', label: '⏰ Reminder', icon: 'Clock' },
  { value: 'promotion', label: '🎉 Promotion', icon: 'Gift' },
];

const getIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    announcement: <Megaphone size={18} />,
    health: <Syringe size={18} />,
    reminder: <Clock size={18} />,
    promotion: <Gift size={18} />,
  };
  return icons[type] || <Radio size={18} />;
};

export default function BroadcastsManage() {
  const { state, actions } = useApp();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('announcement');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create broadcast
      await actions.addBroadcast({
        title,
        message,
        type: type as 'announcement' | 'health' | 'reminder' | 'promotion',
        icon: broadcastTypes.find(t => t.value === type)?.icon || 'Megaphone',
        active: true
      });
      
      // Also create a notification for users
      await actions.addNotification({
        title,
        message,
        type: type as 'announcement' | 'health' | 'reminder' | 'promotion',
      });
      
      toast.success('Broadcast & notification sent successfully!');
      setTitle('');
      setMessage('');
      setType('announcement');
    } catch (error) {
      toast.error('Failed to send broadcast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition">
      <div className={styles.pageHeader}>
        <h1><Radio size={28} /> Broadcast Messages</h1>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2><Send size={20} /> Send New Broadcast</h2>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Broadcast Title *</label>
            <input
              type="text"
              required
              placeholder="Enter broadcast title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Message *</label>
            <textarea
              required
              placeholder="Your message to all users..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              {broadcastTypes.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.formActions}>
            <button 
              type="submit" 
              className={`${styles.btnPrimary}`}
              disabled={loading}
            >
              {loading ? <span className={styles.spinner} /> : <><Send size={18} /> Send Broadcast</>}
            </button>
          </div>
        </form>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2><Clock size={20} /> Previous Broadcasts ({state.broadcasts.length})</h2>
        </div>

        {state.broadcasts.length > 0 ? (
          <div>
            {state.broadcasts.map((broadcast) => (
              <div
                key={broadcast.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.75rem',
                  borderLeft: '4px solid var(--accent-violet)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: 'var(--accent-violet)' }}>
                      {getIcon(broadcast.type)}
                    </span>
                    <strong style={{ color: 'var(--text-dark)' }}>{broadcast.title}</strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    {formatTimeAgo(broadcast.createdAt)}
                  </span>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>{broadcast.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Radio size={48} />
            <p>No broadcasts sent yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

