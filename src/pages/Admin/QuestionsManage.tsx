import { useMemo, useState } from 'react';
import { MessageCircle, Reply, Clock, CheckCircle, X, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatTimeAgo } from '../../services/scheduleService';
import toast from 'react-hot-toast';
import styles from './Admin.module.css';

export default function QuestionsManage() {
  const { state, actions } = useApp();
  const [filter, setFilter] = useState<'review' | 'approved' | 'answered' | 'rejected'>('review');
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredQuestions = useMemo(() => {
    return state.questions.filter((q) => {
      if (filter === 'review') return q.status === 'pending_review';
      if (filter === 'approved') return q.status === 'approved';
      if (filter === 'answered') return q.status === 'answered';
      return q.status === 'rejected';
    });
  }, [state.questions, filter]);

  const handleAnswer = async () => {
    if (!answeringId || !answerText.trim()) return;
    
    setLoading(true);
    try {
      await actions.answerQuestion(answeringId, answerText);
      toast.success('Answer submitted');
      setAnsweringId(null);
      setAnswerText('');
    } catch (error) {
      toast.error('Failed to submit answer');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await actions.approveQuestion(id);
      toast.success('Question approved');
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Reject reason (optional):') || undefined;
    try {
      await actions.rejectQuestion(id, reason);
      toast.success('Question rejected');
    } catch {
      toast.error('Failed to reject');
    }
  };

  return (
    <div className="page-transition">
      <div className={styles.pageHeader}>
        <h1><MessageCircle size={28} /> Questions Management</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          style={{
            padding: '10px 15px',
            border: '2px solid var(--border-light)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem'
          }}
        >
          <option value="review">Pending Review</option>
          <option value="approved">Approved (Needs Answer)</option>
          <option value="answered">Answered (Published)</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Answer Modal */}
      {answeringId && (
        <div className={styles.card} style={{ borderLeft: '4px solid var(--accent-green)', marginBottom: '1.5rem' }}>
          <div className={styles.cardHeader}>
            <h2><Reply size={20} /> Answer Question</h2>
            <button className={styles.btnIcon} onClick={() => setAnsweringId(null)}>
              <X size={18} />
            </button>
          </div>
          
          <div style={{ 
            background: 'var(--off-white)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)',
            marginBottom: '1rem'
          }}>
            <span className={`${styles.badge} ${styles.active}`} style={{ marginBottom: '8px' }}>
              {state.questions.find(q => q.id === answeringId)?.category}
            </span>
            <p style={{ fontWeight: '500', color: 'var(--text-dark)' }}>
              {state.questions.find(q => q.id === answeringId)?.text}
            </p>
          </div>

          <textarea
            className={styles.formGroup}
            placeholder="Type your answer here..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            style={{
              width: '100%',
              minHeight: '120px',
              padding: '12px',
              border: '2px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem'
            }}
          />

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className={styles.btnOutline} onClick={() => setAnsweringId(null)}>
              Cancel
            </button>
            <button 
              className={`${styles.btnPrimary} ${styles.btnGreen}`}
              onClick={handleAnswer}
              disabled={loading || !answerText.trim()}
            >
              {loading ? <span className={styles.spinner} /> : <><Send size={18} /> Submit Answer</>}
            </button>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2>
            {filter === 'review'
              ? 'Pending Review'
              : filter === 'approved'
              ? 'Approved (Needs Answer)'
              : filter === 'answered'
              ? 'Answered (Published)'
              : 'Rejected'}{' '}
            ({filteredQuestions.length})
          </h2>
        </div>

        {filteredQuestions.length > 0 ? (
          <div>
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                style={{
                  padding: '1rem',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.75rem',
                  borderLeft:
                    question.status === 'answered'
                      ? '4px solid var(--accent-green)'
                      : question.status === 'approved'
                      ? '4px solid var(--accent-violet)'
                      : question.status === 'rejected'
                      ? '4px solid var(--primary-red)'
                      : '4px solid #f59e0b',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`${styles.badge} ${
                      question.status === 'answered'
                        ? styles.answered
                        : question.status === 'approved'
                        ? styles.active
                        : question.status === 'rejected'
                        ? styles.pending
                        : styles.pending
                    }`}>
                      {question.status === 'answered' ? (
                        <><CheckCircle size={12} /> Answered</>
                      ) : question.status === 'approved' ? (
                        <><ThumbsUp size={12} /> Approved</>
                      ) : question.status === 'rejected' ? (
                        <><ThumbsDown size={12} /> Rejected</>
                      ) : (
                        <><Clock size={12} /> Pending Review</>
                      )}
                    </span>
                    <span className={`${styles.badge} ${styles.active}`}>{question.category}</span>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    {formatTimeAgo(question.createdAt)}
                  </span>
                </div>

                <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', marginBottom: '10px', fontWeight: '500' }}>
                  {question.text}
                </p>

                {question.answer ? (
                  <div style={{
                    background: 'var(--off-white)',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    borderLeft: '3px solid var(--accent-green)'
                  }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--accent-green)', marginBottom: '5px', fontWeight: '600' }}>
                      Answer:
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-gray)' }}>{question.answer}</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {question.status === 'pending_review' && (
                      <>
                        <button
                          className={`${styles.btnPrimary} ${styles.btnGreen} ${styles.btnSmall}`}
                          onClick={() => handleApprove(question.id)}
                        >
                          <ThumbsUp size={16} /> Approve
                        </button>
                        <button
                          className={`${styles.btnPrimary} ${styles.btnSmall}`}
                          style={{ background: 'linear-gradient(135deg, var(--primary-red), var(--secondary-red))' }}
                          onClick={() => handleReject(question.id)}
                        >
                          <ThumbsDown size={16} /> Reject
                        </button>
                      </>
                    )}
                    {question.status === 'approved' && (
                      <button
                        className={`${styles.btnPrimary} ${styles.btnViolet} ${styles.btnSmall}`}
                        onClick={() => {
                          setAnsweringId(question.id);
                          setAnswerText('');
                        }}
                      >
                        <Reply size={16} /> Answer (Publish)
                      </button>
                    )}
                    {question.status === 'rejected' && (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                        {question.rejectReason ? `Reason: ${question.rejectReason}` : 'Rejected'}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <MessageCircle size={48} />
            <p>No questions found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

