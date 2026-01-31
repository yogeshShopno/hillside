import { useState } from 'react';
import { Users, Plus, Edit, Trash2, X, Save, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Provider } from '../../types';
import toast from 'react-hot-toast';
import styles from './Admin.module.css';

const emptyProvider = {
  name: '',
  title: '',
  specialty: 'Family Medicine',
  bio: '',
  imageUrl: '',
  phone: '(210) 742-6555',
  address: '12881 I35, San Antonio, TX 78233',
  patientFusionUrl: '',
  acceptingPatients: true,
  hours: {
    weekday: '7:30am - 4:00pm',
    saturday: '8:00am - 12:00pm',
    sunday: 'Closed'
  }
};

export default function ProvidersManage() {
  const { state, actions } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyProvider);
  const [loading, setLoading] = useState(false);

  const handleEdit = (provider: Provider) => {
    setFormData({
      name: provider.name,
      title: provider.title,
      specialty: provider.specialty,
      bio: provider.bio,
      imageUrl: provider.imageUrl,
      phone: provider.phone,
      address: provider.address,
      patientFusionUrl: provider.patientFusionUrl,
      acceptingPatients: provider.acceptingPatients,
      hours: provider.hours
    });
    setEditingId(provider.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this provider?')) return;
    
    try {
      await actions.deleteProvider(id);
      toast.success('Provider deleted');
    } catch (error) {
      toast.error('Failed to delete provider');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await actions.updateProvider(editingId, formData);
        toast.success('Provider updated');
      } else {
        await actions.addProvider(formData);
        toast.success('Provider added');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyProvider);
    } catch (error) {
      toast.error('Failed to save provider');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyProvider);
  };

  return (
    <div className="page-transition">
      <div className={styles.pageHeader}>
        <h1><Users size={28} /> Providers Management</h1>
        <button 
          className={`${styles.btnPrimary} ${styles.btnViolet}`}
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} /> Add Provider
        </button>
      </div>

      {showForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>{editingId ? 'Edit Provider' : 'Add New Provider'}</h2>
            <button className={styles.btnIcon} onClick={handleCancel}>
              <X size={18} />
            </button>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Title *</label>
                <input
                  type="text"
                  required
                  placeholder="FNP-BC, MD, etc."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Specialty</label>
                <select
                  value={formData.specialty}
                  onChange={(e) => setFormData(prev => ({ ...prev, specialty: e.target.value }))}
                >
                  <option value="Family Medicine">Family Medicine</option>
                  <option value="Internal Medicine">Internal Medicine</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Podiatry">Podiatry</option>
                  <option value="Physical Therapy">Physical Therapy</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Profile Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Bio / Description *</label>
              <textarea
                required
                placeholder="Provider biography and credentials..."
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label>PatientFusion URL (for schedule automation) *</label>
              <input
                type="url"
                required
                placeholder="https://www.patientfusion.com/doctor/..."
                value={formData.patientFusionUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, patientFusionUrl: e.target.value }))}
              />
              <small style={{ color: 'var(--text-light)', fontSize: '0.8rem' }}>
                This URL is used to fetch available appointment slots automatically
              </small>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={formData.acceptingPatients}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptingPatients: e.target.checked }))}
                  style={{ width: 'auto' }}
                />
                Accepting New Patients
              </label>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnOutline} onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className={`${styles.btnPrimary} ${styles.btnGreen}`} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : <><Save size={18} /> Save Provider</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>All Providers ({state.providers.length})</h2>
        </div>

        {state.providers.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Specialty</th>
                <th>PatientFusion URL</th>
                <th>Status</th>
                <th>Actions</th>
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
                    {provider.patientFusionUrl ? (
                      <a 
                        href={provider.patientFusionUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--accent-violet)', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <ExternalLink size={14} /> View
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-light)' }}>Not set</span>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${provider.acceptingPatients ? styles.success : styles.pending}`}>
                      {provider.acceptingPatients ? 'Accepting' : 'Not Accepting'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className={styles.btnIcon}
                        onClick={() => handleEdit(provider)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className={`${styles.btnIcon} ${styles.danger}`}
                        onClick={() => handleDelete(provider.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <Users size={48} />
            <p>No providers added yet. Click "Add Provider" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

