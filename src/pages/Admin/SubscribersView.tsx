import { UserPlus, Mail, CheckCircle, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAgo } from '../../services/scheduleService';
import styles from './Admin.module.css';

export default function SubscribersView() {
  const { state } = useApp();

  return (
    <div className="page-transition">
      <div className={styles.pageHeader}>
        <h1><UserPlus size={28} /> Newsletter Subscribers</h1>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>All Subscribers ({state.subscribers.length})</h2>
        </div>

        {state.subscribers.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subscribed</th>
                <th>Health Tips</th>
              </tr>
            </thead>
            <tbody>
              {state.subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>
                    <strong>{subscriber.name}</strong>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Mail size={14} color="var(--text-light)" />
                      {subscriber.email}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {formatTimeAgo(subscriber.subscribedAt)}
                  </td>
                  <td>
                    {subscriber.healthArticles ? (
                      <span className={`${styles.badge} ${styles.success}`}>
                        <CheckCircle size={12} /> Yes
                      </span>
                    ) : (
                      <span className={`${styles.badge} ${styles.pending}`}>
                        <XCircle size={12} /> No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <UserPlus size={48} />
            <p>No subscribers yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

