import { useState } from 'react';
import { FileText, Plus, Edit, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { Article } from '../../types';
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

const emptyArticle = {
  title: '',
  description: '',
  content: '',
  categoryId: 'primary',
  imageUrl: '',
  author: 'Medical Team',
  published: true
};

export default function ArticlesManage() {
  const { state, actions } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyArticle);
  const [loading, setLoading] = useState(false);

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      description: article.description,
      content: article.content,
      categoryId: article.categoryId,
      imageUrl: article.imageUrl || '',
      author: article.author,
      published: article.published
    });
    setEditingId(article.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await actions.deleteArticle(id);
      toast.success('Article deleted');
    } catch (error) {
      toast.error('Failed to delete article');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await actions.updateArticle(editingId, formData);
        toast.success('Article updated');
      } else {
        await actions.addArticle(formData);
        toast.success('Article added');
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyArticle);
    } catch (error) {
      toast.error('Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyArticle);
  };

  return (
    <div className="page-transition">
      <div className={styles.pageHeader}>
        <h1><FileText size={28} /> Articles Management</h1>
        <button 
          className={`${styles.btnPrimary} ${styles.btnViolet}`}
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} /> Add Article
        </button>
      </div>

      {showForm && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2>{editingId ? 'Edit Article' : 'Add New Article'}</h2>
            <button className={styles.btnIcon} onClick={handleCancel}>
              <X size={18} />
            </button>
          </div>
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Title *</label>
              <input
                type="text"
                required
                placeholder="Article title..."
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
                <label>Author</label>
                <input
                  type="text"
                  placeholder="Author name"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Short Description *</label>
              <textarea
                required
                placeholder="Brief description of the article..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Full Content *</label>
              <div style={{ 
                background: 'rgba(139, 92, 246, 0.08)', 
                padding: '12px 16px', 
                borderRadius: '12px', 
                marginBottom: '12px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)'
              }}>
                <strong style={{ color: 'var(--secondary)' }}>📝 Rich Content Tags:</strong>
                <ul style={{ margin: '8px 0 0 20px', lineHeight: '1.8' }}>
                  <li><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>[img:URL:alt text]</code> - Insert image</li>
                  <li><code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>[link:URL:link text]</code> - Insert clickable link</li>
                  <li>Use blank lines for paragraph breaks</li>
                </ul>
              </div>
              <textarea
                required
                placeholder="Write your article content here...

Example:
Welcome to our health guide! Here's what you need to know.

[img:https://example.com/image.jpg:Health diagram]

For more information, visit [link:https://healthsite.com:this resource].

Remember to consult with your healthcare provider for personalized advice."
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                style={{ minHeight: '280px', fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Featured Image URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
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
                Publish Article
              </label>
            </div>

            <div className={styles.formActions}>
              <button type="button" className={styles.btnOutline} onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className={`${styles.btnPrimary} ${styles.btnGreen}`} disabled={loading}>
                {loading ? <span className={styles.spinner} /> : <><Save size={18} /> Save Article</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>All Articles ({state.articles.length})</h2>
        </div>

        {state.articles.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {state.articles.map((article) => (
                <tr key={article.id}>
                  <td>
                    <strong>{article.title}</strong>
                    <br />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                      {article.description.substring(0, 50)}...
                    </span>
                  </td>
                  <td>{categories.find(c => c.id === article.categoryId)?.name}</td>
                  <td>{article.author}</td>
                  <td>
                    <span className={`${styles.badge} ${article.published ? styles.success : styles.pending}`}>
                      {article.published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Draft</>}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className={styles.btnIcon}
                        onClick={() => handleEdit(article)}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className={`${styles.btnIcon} ${styles.danger}`}
                        onClick={() => handleDelete(article.id)}
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
            <FileText size={48} />
            <p>No articles added yet. Click "Add Article" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

