// Components/ArtifactDetail.jsx
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { artifactsApi, commentsApi } from '../api/client';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './ArtifactDetail.css';

const FALLBACK = 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80';

export default function ArtifactDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const { data: artifact, loading, error, refetch } = useFetch(
    () => artifactsApi.getById(id), 
    [id]
  );
  
  const { data: comments, loading: commentsLoading, refetch: refetchComments } = useFetch(
    () => commentsApi.getByArtifact(id), 
    [id]
  );

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');

  if (loading) return <LoadingSpinner message="Loading artwork..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!artifact) return <ErrorMessage message="Artwork not found." />;

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    setCommentError('');
    try {
      await commentsApi.create({ artifactId: Number(id), text: commentText.trim() });
      setCommentText('');
      await refetchComments();
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsApi.delete(commentId);
      await refetchComments();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <main className="artifact-detail">
      <div className="artifact-detail__hero">
        <div className="artifact-detail__img-side">
          <div className="artifact-detail__img-wrap">
            <img src={artifact.imageurl || FALLBACK} alt={artifact.title} />
          </div>
        </div>
        <div className="artifact-detail__info-side">
          <Link to="/artifacts" className="back-link">← Collection</Link>
          <div className="artifact-detail__era">Artwork</div>
          <h1 className="artifact-detail__title">{artifact.title}</h1>
          
          {artifact.artistid && (
            <Link to={`/artists/${artifact.artistid}`} className="artifact-detail__artist-link">
              <div className="artifact-detail__artist-name">
                View Artist Profile →
              </div>
            </Link>
          )}

          {artifact.description && (
            <>
              <p className="artifact-detail__description">{artifact.description}</p>
            </>
          )}

          <div className="artifact-detail__specs">
            <div className="artifact-detail__spec">
              <span className="artifact-detail__spec-label">Year</span>
              <span className="artifact-detail__spec-value">{artifact.yearcreated || 'Unknown'}</span>
            </div>
            <div className="artifact-detail__spec">
              <span className="artifact-detail__spec-label">Medium</span>
              <span className="artifact-detail__spec-value">{artifact.medium || 'Not specified'}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="artifact-comments">
            <span className="section-label">Community ({comments?.length ?? 0})</span>

            {user ? (
              <form className="comment-form" onSubmit={handleCommentSubmit}>
                <div className="comment-form__avatar">
                  {user.profileImageUrl ? (
                    <img src={user.profileImageUrl} alt={user.firstName} />
                  ) : (
                    <div className="comment-form__initials">
                      {user.firstName?.[0]}{user.lastName?.[0]}
                    </div>
                  )}
                </div>
                <div className="comment-form__right">
                  <textarea
                    className="comment-form__input"
                    placeholder="Share your thoughts on this work..."
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    rows={3}
                    required
                  />
                  {commentError && <p className="comment-form__error">{commentError}</p>}
                  <button
                    className="comment-form__submit btn btn--primary"
                    type="submit"
                    disabled={submitting || !commentText.trim()}
                  >
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <p className="comment-signin-prompt">
                <button onClick={() => document.querySelector('.navbar__cta')?.click()} className="text-link">
                  Sign in
                </button> to leave a comment.
              </p>
            )}

            {commentsLoading && <LoadingSpinner message="Loading comments..." />}

            <div className="comments-list">
              {comments?.map(c => (
                <div key={c.id} className="comment">
                  <img 
                    src={c.userProfileImage || FALLBACK} 
                    alt={c.userFirstName} 
                    className="comment__avatar" 
                  />
                  <div>
                    <div className="comment__header">
                      <div className="comment__name">{c.userFirstName} {c.userLastName}</div>
                      <div className="comment__date">
                        {new Date(c.createdat).toLocaleDateString('en-AU', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </div>
                    <p className="comment__text">{c.text}</p>
                    {user && user.id === c.userid && (
                      <div className="comment__footer">
                        <button 
                          className="comment__delete" 
                          onClick={() => handleDeleteComment(c.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {!commentsLoading && comments?.length === 0 && (
                <p className="comments-empty">No comments yet. Be the first to share your thoughts.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}