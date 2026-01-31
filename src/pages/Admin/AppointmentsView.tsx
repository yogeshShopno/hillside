import { Calendar, Clock, Mail, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import styles from './Admin.module.css';

export default function AppointmentsView() {
  const { state } = useApp();

  return (
    <div className="page-transition">
      <div className={styles.pageHeader}>
        <h1><Calendar size={28} /> Appointments</h1>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>All Appointments ({state.appointments.length})</h2>
        </div>

        {state.appointments.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Provider</th>
                <th>Date & Time</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {state.appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px',
                        height: '36px',
                        background: 'linear-gradient(135deg, var(--accent-violet), var(--dark-violet))',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <strong>{appointment.patientName}</strong>
                    </div>
                  </td>
                  <td>{appointment.providerName}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontWeight: '500' }}>{appointment.date}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--accent-violet)' }}>
                        <Clock size={12} style={{ marginRight: '4px' }} />
                        {appointment.time}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Phone size={12} /> {appointment.patientPhone}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Mail size={12} /> {appointment.patientEmail}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.pending}`}>
                      {appointment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <Calendar size={48} />
            <p>No appointments booked yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

