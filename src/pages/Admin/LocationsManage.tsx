import { useMemo, useState } from 'react';
import { MapPin, Plus, Trash2, Edit, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import type { Location } from '../../types';
import styles from './Admin.module.css';

const empty = {
  name: '',
  address: '',
  gmapUrl: '',
};

export default function LocationsManage() {
  const { state, actions } = useApp();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);

  const list = useMemo(() => state.locations || [], [state.locations]);

  const startAdd = () => {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  };

  const startEdit = (loc: Location) => {
    setEditingId(loc.id);
    setForm({ name: loc.name, address: loc.address, gmapUrl: loc.gmapUrl });
    setOpen(true);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await actions.updateLocation(editingId, form);
        toast.success('Location updated');
      } else {
        await actions.addLocation(form);
        toast.success('Location added');
      }
      setOpen(false);
      setEditingId(null);
      setForm(empty);
    } catch {
      toast.error('Failed to save location');
    }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this location?')) return;
    try {
      await actions.deleteLocation(id);
      toast.success('Location deleted');
    } catch {
      toast.error('Failed to delete location');
    }
  };

  return (
    <div className="page-transition">
      <div className={styles.pageHeader}>
        <h1>
          <MapPin size={28} /> Locations
        </h1>
        <button className={`${styles.btnPrimary} ${styles.btnViolet}`} onClick={startAdd}>
          <Plus size={18} /> Add Location
        </button>
      </div>

      {open && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>{editingId ? 'Edit Location' : 'Add Location'}</h2>
            <button className={styles.btnIcon} onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
          <form className={styles.form} onSubmit={submit}>
            <div className={styles.formGroup}>
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            </div>
            <div className={styles.formGroup}>
              <label>Address *</label>
              <input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} required />
            </div>
            <div className={styles.formGroup}>
              <label>Google Maps Link *</label>
              <input value={form.gmapUrl} onChange={(e) => setForm((p) => ({ ...p, gmapUrl: e.target.value }))} required />
            </div>
            <div className={styles.formActions}>
              <button type="button" className={styles.btnOutline} onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="submit" className={`${styles.btnPrimary} ${styles.btnGreen}`}>
                <Save size={18} /> Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>All Locations ({list.length})</h2>
        </div>

        {list.length ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Address</th>
                <th>Maps</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((loc) => (
                <tr key={loc.id}>
                  <td>
                    <strong>{loc.name}</strong>
                  </td>
                  <td>{loc.address}</td>
                  <td>
                    <a href={loc.gmapUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-violet)' }}>
                      Open
                    </a>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className={styles.btnIcon} onClick={() => startEdit(loc)} title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className={`${styles.btnIcon} ${styles.danger}`} onClick={() => del(loc.id)} title="Delete">
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
            <MapPin size={48} />
            <p>No locations yet. Add one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}


