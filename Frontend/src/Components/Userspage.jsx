// pages/UsersPage.jsx
import { userApi } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './UsersPage.css'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80'

export default function UsersPage() {
  const { user: currentUser, loading: authLoading } = useAuth()
  const isAdmin = currentUser?.role === 'Admin'

  const { data: users, loading, error, refetch } = useFetch(
    // Only call the endpoint if we're an admin; otherwise return empty
    () => isAdmin ? userApi.getAll() : Promise.resolve([]),
    [isAdmin]
  )

  if (authLoading || loading) return <LoadingSpinner message="Loading community…" />

  return (
    <main className="users-page">
      <div className="page-hero-thin">
        <div className="page-container">
          <span className="section-label fade-up">Community</span>
          <h1 className="page-hero-thin__title fade-up delay-1">
            Our Gallery<br /><em>Community</em>
          </h1>
          <p className="page-hero-thin__desc fade-up delay-2">
            A growing community of people who believe in the power of Aboriginal
            art to connect us to country, culture, and each other.
          </p>
        </div>
      </div>

      <div className="page-container">
        {!currentUser && (
          <div className="users-page__signin-prompt">
            <p>Sign in to explore the community.</p>
          </div>
        )}

        {currentUser && !isAdmin && (
          <div className="users-page__welcome">
            <div className="users-page__welcome-avatar">
              {currentUser.profileImageUrl
                ? <img src={currentUser.profileImageUrl} alt={currentUser.firstName} />
                : <div className="users-page__initials">{currentUser.firstName?.[0]}{currentUser.lastName?.[0]}</div>
              }
            </div>
            <div>
              <h2 className="users-page__welcome-name">
                Welcome, {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className="users-page__welcome-email">{currentUser.email}</p>
              <p className="users-page__welcome-role">Member since {new Date(currentUser.createdAt).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        )}

        {isAdmin && (
          <>
            {error && <ErrorMessage message={error} onRetry={refetch} />}
            <div className="section-header" style={{ marginBottom: '2rem' }}>
              <span className="section-label">All Members ({users?.length ?? 0})</span>
            </div>
            <div className="users-grid">
              {users?.map(u => (
                <div key={u.id} className="user-card">
                  <div className="user-card__avatar">
                    {u.profileImage
                      ? <img src={u.profileImage} alt={u.firstName} />
                      : <div className="user-card__initials">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                    }
                  </div>
                  <div className="user-card__info">
                    <div className="user-card__name">{u.firstName} {u.lastName}</div>
                    <div className="user-card__email">{u.email}</div>
                    <div className={`user-card__role user-card__role--${u.role?.toLowerCase()}`}>{u.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}