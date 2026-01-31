import { useState } from 'react';
import { Video, Plus, Trash2, X, Save, Youtube, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getYouTubeThumbnail, getYouTubeVideoId } from '../../services/scheduleService';
import toast from 'react-hot-toast';
import styles from './Admin.module.css';

const categories = [
  { id: 'primary', name: 'Primary Health' },
  { id: 'mental', name: 'Mental Health' },
  { id: 'feet', name: 'Feet Health' },
  { id: 'weight', name: 'Weight Loss' },
  { id: 'women', name: "Women's Health" },
  { id: 'physical', name: 'Physical Therapy' },
];

const emptyVideo = {
  title: '',
  description: '',
  youtubeUrl: '',
  thumbnailUrl: '',
  categoryId: 'primary',
  duration: '',
  published: true
};

export default function VideosManage() {
  const { state, actions } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyVideo);
  const [loading, setLoading] = useState(false);

  const handleUrlChange = (url: string) => {
    setFormData(prev => ({
      ...prev,
      youtubeUrl: url,
      thumbnailUrl: getYouTubeThumbnail(url)
    }));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      await actions.deleteVideo(id);
      toast.success('Video deleted');
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!getYouTubeVideoId(formData.youtubeUrl)) {
      toast.error('Please enter a valid YouTube URL');
      return;
    }
    
    setLoading(true);

    try {
      await actions.addVideo({
        ...formData,
        thumbnailUrl: formData.thumbnailUrl || getYouTubeThumbnail(formData.youtubeUrl)
      });
      
      toast.success('Video added');
      setShowForm(false);
      setFormData(emptyVideo);
    } catch (error) {
      toast.error('Failed to save video');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData(emptyVideo);
  };

  return (
    <div className="page-transition">
      <div className={styles.pageHeader}>
        <h1><Video size={28} /> Videos Management</h1>
        <button 
          className={`${styles.btnPrimary} ${styles.btnViolet}`}
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} /> Add Video
        </button>
      </div>

      {showForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2><Youtube size={20} /> Add YouTube Video</h2>
            <button className={styles.btnIcon} onClick={handleCancel}>
              <X size={18} />
            </button>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>YouTube URL *</label>
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.youtubeUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
              {formData.thumbnailUrl && (
                <div style={{ marginTop: '10px' }}>
                  <img 
                    src={formData.thumbnailUrl} 
                    alt="Video thumbnail" 
                    style={{ 
                      width: '200px', 
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)'
                    }} 
                  />
                </div>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Video Title *</label>
              <input
                type="text"
                required
                placeholder="Video title..."
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Duration</label>
                <input
                  type="text"
                  placeholder="e.g., 10:30"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                placeholder="Brief description of the video..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  style={{ width: 'auto' }}
                />
                Publish Video
              </label>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnOutline} onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className={`${styles.btnPrimary} ${styles.btnGreen}`} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : <><Save size={18} /> Add Video</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>All Videos ({state.videos.length})</h2>
        </div>

        {state.videos.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {state.videos.map((video) => (
              <div 
                key={video.id}
                style={{
                  background: 'var(--off-white)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img 
                    src={video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl)} 
                    alt={video.title}
                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                  />
                  {video.duration && (
                    <span style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.8)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {video.duration}
                    </span>
                  )}
                </div>
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '5px' }}>{video.title}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    {categories.find(c => c.id === video.categoryId)?.name}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <a 
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnIcon}
                      title="Open in YouTube"
                    >
                      <ExternalLink size={16} />
                    </a>
                    <button 
                      className={`${styles.btnIcon} ${styles.danger}`}
                      onClick={() => handleDelete(video.id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Video size={48} />
            <p>No videos added yet. Click "Add Video" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

