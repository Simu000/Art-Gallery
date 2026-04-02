// pages/ArtifactDetail.jsx
import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { artifactsApi, commentsApi } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../context/Authcontext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './ArtifactDetail.css'

const FALLBACK = 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80'

export default function ArtifactDetail() {
  const { id } = useParams()
  const { user } = useAuth()

  const { data: artifact, loading, error, refetch } = useFetch(
    () => artifactsApi.getById(id), [id]
  )
  const {
    data: comments,
    loading: commentsLoading,
    refetch: refetchComments,
  } = useFetch(() => commentsApi.getByArtifact(id), [id])

  const [commentText, setCommentText]   = useState('')
  const [submitting, setSubmitting]     = useState(false)
  const [commentError, setCommentError] = useState('')

  if (loading) return <LoadingSpinner message="Loading artwork…" />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />
  if (!artifact) return <ErrorMessage message="Artwork not found." />

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    setSubmitting(true)
    setCommentError('')
    try {
      await commentsApi.create({ artifactId: Number(id), text: commentText.trim() })
      setCommentText('')
      await refetchComments()
    } catch (err) {
      setCommentError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await commentsApi.delete(commentId)
      await refetchComments()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <main className="artifact-detail">
      <div className="artifact-detail__hero">
        <img
          src={artifact.imageUrl || FALLBACK}
          alt={artifact.title}
          className="artifact-detail__hero-img"
        />
        <div className="artifact-detail__hero-overlay" />
        <div className="artifact-detail__hero-content">
          <Link to="/artifacts" className="back-link">← Collection</Link>
          <h1 className="artifact-detail__title">{artifact.title}</h1>
          <div className="artifact-detail__artist">
            {artifact.artistFirstName} {artifact.artistLastName}
          </div>
        </div>
      </div>

      <div className="page-container">
        <div className="artifact-detail__body">
          {/* Info panel */}
          <aside className="artifact-detail__meta">
            <span className="section-label">Details</span>
            <div className="artifact-meta-grid">
              <div className="artifact-meta-item">
                <span className="artifact-meta-item__label">Artist</span>
                <Link
                  to={`/artists/${artifact.artistId}`}
                  className="artifact-meta-item__value artifact-meta-item__value--link"
                >
                  {artifact.artistFirstName} {artifact.artistLastName}
                </Link>
              </div>
              <div className="artifact-meta-item">
                <span className="artifact-meta-item__label">Year</span>
                <span className="artifact-meta-item__value">{artifact.yearCreated}</span>
              </div>
              <div className="artifact-meta-item">
                <span className="artifact-meta-item__label">Medium</span>
                <span className="artifact-meta-item__value">{artifact.medium}</span>
              </div>
            </div>
          </aside>

          {/* Description + comments */}
          <div className="artifact-detail__main">
            {artifact.description && (
              <>
                <span className="section-label">About this work</span>
                <p className="artifact-detail__description">{artifact.description}</p>
              </>
            )}

            {/* Comments section */}
            <div className="artifact-comments">
              <span className="section-label">
                Community ({comments?.length ?? 0})
              </span>

              {user ? (
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                  <div className="comment-form__avatar">
                    {user.profileImageUrl
                      ? <img src={user.profileImageUrl} alt={user.firstName} />
                      : <div className="comment-form__initials">{user.firstName?.[0]}{user.lastName?.[0]}</div>
                    }
                  </div>
                  <div className="comment-form__right">
                    <textarea
                      className="comment-form__input"
                      placeholder="Share your thoughts on this work…"
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
                      {submitting ? 'Posting…' : 'Post Comment'}
                    </button>
                  </div>
                </form>
              ) : (
                <p className="comment-signin-prompt">
                  <Link to="#" className="text-link">Sign in</Link> to leave a comment.
                </p>
              )}

              {commentsLoading && <LoadingSpinner message="Loading comments…" />}

              <div className="comments-list">
                {comments?.map(c => (
                  <div key={c.id} className="comment-item">
                    <div className="comment-item__header">
                      <div className="comment-item__author">
                        {c.userFirstName} {c.userLastName}
                      </div>
                      <div className="comment-item__date">
                        {new Date(c.createdAt).toLocaleDateString('en-AU', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                      {/* Allow delete if the comment belongs to the logged-in user */}
                      {user && user.id === c.userId && (
                        <button
                          className="comment-item__delete"
                          onClick={() => handleDeleteComment(c.id)}
                          title="Delete comment"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <p className="comment-item__text">{c.text}</p>
                  </div>
                ))}
                {!commentsLoading && comments?.length === 0 && (
                  <p className="comments-empty">No comments yet. Be the first to share your thoughts.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}