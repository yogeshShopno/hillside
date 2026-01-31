import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, User, ArrowRight, ChevronLeft, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getYouTubeThumbnail, formatTimeAgo } from '../../services/scheduleService';
import styles from './Health.module.css';

const categories = [
  { id: 'all', name: 'All', color: '#64748b' },
  { id: 'primary', name: 'Primary Care', color: '#3b82f6' },
  { id: 'mental', name: 'Mental Health', color: '#8b5cf6' },
  { id: 'feet', name: 'Feet Health', color: '#10b981' },
  { id: 'women', name: "Women's Health", color: '#ec4899' },
  { id: 'weight', name: 'Weight Loss', color: '#f59e0b' },
  { id: 'physical', name: 'Physical Therapy', color: '#06b6d4' },
];

// Parse article content with special tags
// Supports: [img:url:alt], [link:url:text], **bold**, *italic*
const parseArticleContent = (content: string): React.ReactNode[] => {
  if (!content) return [];
  
  const parts: React.ReactNode[] = [];
  // let remaining = content;
  let key = 0;
  
  // Pattern for custom tags
  const tagPattern = /\[(img|link):([^\]]+)\]/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = tagPattern.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const text = content.slice(lastIndex, match.index);
      parts.push(<span key={key++}>{parseTextFormatting(text)}</span>);
    }
    
    const [fullMatch, type, params] = match;
    const paramParts = params.split(':');
    
    if (type === 'img') {
      const [url, alt = 'Image'] = paramParts;
      parts.push(
        <figure key={key++} className={styles.articleImage}>
          <img src={url} alt={alt} loading="lazy" />
          {alt && alt !== 'Image' && <figcaption>{alt}</figcaption>}
        </figure>
      );
    } else if (type === 'link') {
      const [url, text = url] = paramParts;
      parts.push(
        <a 
          key={key++} 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.articleLink}
        >
          {text} <ExternalLink size={14} />
        </a>
      );
    }
    
    lastIndex = match.index + fullMatch.length;
  }
  
  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(<span key={key++}>{parseTextFormatting(content.slice(lastIndex))}</span>);
  }
  
  return parts.length > 0 ? parts : [<span key={0}>{content}</span>];
};

// Parse basic text formatting (**bold**, *italic*)
const parseTextFormatting = (text: string): React.ReactNode => {
  // Split by newlines and add proper paragraph breaks
  return text.split('\n\n').map((paragraph, pIdx) => (
    <p key={pIdx} style={{ marginBottom: '1rem' }}>
      {paragraph.split('\n').map((line, lIdx) => (
        <span key={lIdx}>
          {lIdx > 0 && <br />}
          {line}
        </span>
      ))}
    </p>
  ));
};

export default function Health() {
  const { state } = useApp();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  
  const [activeCategory, setActiveCategory] = useState(categoryId || 'all');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  
  // Filter published articles
  const publishedArticles = useMemo(() => {
    return state.articles
      .filter(a => a.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [state.articles]);
  
  // Filter articles by category
  const filteredArticles = useMemo(() => {
    if (activeCategory === 'all') return publishedArticles;
    return publishedArticles.filter(a => a.categoryId === activeCategory);
  }, [publishedArticles, activeCategory]);
  
  // Recent articles (top 5)
  const recentArticles = useMemo(() => {
    return publishedArticles.slice(0, 5);
  }, [publishedArticles]);
  
  // Filter videos by category
  const filteredVideos = useMemo(() => {
    const published = state.videos.filter(v => v.published);
    if (activeCategory === 'all') return published;
    return published.filter(v => v.categoryId === activeCategory);
  }, [state.videos, activeCategory]);
  
  // Get currently viewed article
  const currentArticle = useMemo(() => {
    return state.articles.find(a => a.id === selectedArticle);
  }, [state.articles, selectedArticle]);
  
  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    setSelectedArticle(null);
    navigate(catId === 'all' ? '/health' : `/health/${catId}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Health <span className="gradient-text">Library</span></h1>
        <p className={styles.subtitle}>Expert medical articles and educational videos from our healthcare professionals</p>
        <div className={styles.categoryScroll}>
          {categories.map(cat => (
            <button 
              key={cat.id} 
              className={`${styles.catPill} ${activeCategory === cat.id ? styles.catPillActive : ''}`}
              style={{ '--cat-color': cat.color } as any}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {selectedArticle && currentArticle ? (
          // Article Detail View
          <motion.article
            key="article-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.articleDetail}
          >
            <button 
              className={styles.backBtn}
              onClick={() => setSelectedArticle(null)}
            >
              <ChevronLeft size={20} /> Back to articles
            </button>
            
            {currentArticle.imageUrl && (
              <div className={styles.articleHero}>
                <img src={currentArticle.imageUrl} alt={currentArticle.title} />
              </div>
            )}
            
            <div className={styles.articleMeta}>
              <span className={styles.catBadge} style={{ '--cat-color': categories.find(c => c.id === currentArticle.categoryId)?.color } as any}>
                {categories.find(c => c.id === currentArticle.categoryId)?.name || 'General'}
              </span>
              <span className={styles.metaItem}>
                <User size={14} /> {currentArticle.author}
              </span>
              <span className={styles.metaItem}>
                <Clock size={14} /> {formatTimeAgo(currentArticle.createdAt)}
              </span>
            </div>
            
            <h1 className={styles.articleTitle}>{currentArticle.title}</h1>
            <p className={styles.articleDesc}>{currentArticle.description}</p>
            
            <div className={styles.articleContent}>
              {parseArticleContent(currentArticle.content)}
            </div>
          </motion.article>
        ) : (
          // Articles Grid View
          <motion.div
            key="articles-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Recent Articles Section */}
            {activeCategory === 'all' && recentArticles.length > 0 && (
              <section className={styles.section}>
                <h2>📰 Recent Articles</h2>
                <div className={styles.recentGrid}>
                  {recentArticles.map((article, idx) => (
                    <motion.div
                      key={article.id}
                      className={`${styles.articleCard} ${idx === 0 ? styles.featured : ''}`}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedArticle(article.id)}
                    >
                      {article.imageUrl ? (
                        <div className={styles.articleThumb}>
                          <img src={article.imageUrl} alt={article.title} />
                        </div>
                      ) : (
                        <div className={styles.articleThumbPlaceholder}>
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <div className={styles.articleInfo}>
                        <span 
                          className={styles.catTag}
                          style={{ '--cat-color': categories.find(c => c.id === article.categoryId)?.color } as any}
                        >
                          {categories.find(c => c.id === article.categoryId)?.name || 'General'}
                        </span>
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <div className={styles.articleFooter}>
                          <span><User size={12} /> {article.author}</span>
                          <span><Clock size={12} /> {formatTimeAgo(article.createdAt)}</span>
                        </div>
                        <span className={styles.readMore}>
                          Read article <ArrowRight size={14} />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Filtered Articles Section */}
            <section className={styles.section}>
              <h2>
                {activeCategory === 'all' ? '📚 All Articles' : `📂 ${categories.find(c => c.id === activeCategory)?.name} Articles`}
                {filteredArticles.length > 0 && <span className={styles.count}>({filteredArticles.length})</span>}
              </h2>
              
              {filteredArticles.length > 0 ? (
                <div className={styles.articlesGrid}>
                  {filteredArticles.map((article) => (
                    <motion.div
                      key={article.id}
                      className={styles.articleCard}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedArticle(article.id)}
                    >
                      {article.imageUrl ? (
                        <div className={styles.articleThumb}>
                          <img src={article.imageUrl} alt={article.title} />
                        </div>
                      ) : (
                        <div className={styles.articleThumbPlaceholder}>
                          <ImageIcon size={24} />
                        </div>
                      )}
                      <div className={styles.articleInfo}>
                        <span 
                          className={styles.catTag}
                          style={{ '--cat-color': categories.find(c => c.id === article.categoryId)?.color } as any}
                        >
                          {categories.find(c => c.id === article.categoryId)?.name || 'General'}
                        </span>
                        <h3>{article.title}</h3>
                        <p>{article.description}</p>
                        <div className={styles.articleFooter}>
                          <span><User size={12} /> {article.author}</span>
                          <span><Clock size={12} /> {formatTimeAgo(article.createdAt)}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <ImageIcon size={48} />
                  <p>No articles in this category yet.</p>
                </div>
              )}
            </section>

            {/* Videos Section */}
            <section className={styles.section}>
              <h2>
                🎬 {activeCategory === 'all' ? 'Featured Videos' : `${categories.find(c => c.id === activeCategory)?.name} Videos`}
                {filteredVideos.length > 0 && <span className={styles.count}>({filteredVideos.length})</span>}
              </h2>
              
              {filteredVideos.length > 0 ? (
                <div className={styles.videoGrid}>
                  {filteredVideos.map((video) => (
                    <motion.a
                      key={video.id}
                      href={video.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.videoCard}
                      whileHover={{ y: -5 }}
                    >
                      <div className={styles.thumbnail}>
                        <img src={video.thumbnailUrl || getYouTubeThumbnail(video.youtubeUrl)} alt={video.title} />
                        <div className={styles.playOverlay}><Play fill="white" size={24} /></div>
                        <span className={styles.duration}>{video.duration || '10:00'}</span>
                      </div>
                      <div className={styles.videoInfo}>
                        <h3>{video.title}</h3>
                        <span className={styles.catLabel}>
                          {categories.find(c => c.id === video.categoryId)?.name || 'General'}
                        </span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <Play size={48} />
                  <p>No videos in this category yet.</p>
                </div>
              )}
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
