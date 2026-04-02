// pages/Exhibitions.jsx
import { Link } from 'react-router-dom'
import { exhibitionsApi } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './Exhibitions.css'

const FALLBACK = 'https://images.unsplash.com/photo-1531243269054-1c6a7b70af21?w=1600&q=80'

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function getStatus(ex) {
  const now  = new Date()
  const start = new Date(ex.startDate)
  const end   = new Date(ex.endDate)
  if (now < start) return 'upcoming'
  if (now > end)   return 'past'
  return 'current'
}

const STATUS_LABEL = {
  current:  'Now Showing',
  upcoming: 'Upcoming',
  past:     'Past',
}

export default function Exhibitions() {
  const { data: exhibitions, loading, error, refetch } = useFetch(exhibitionsApi.getAll)

  if (loading) return <LoadingSpinner message="Loading exhibitions…" />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />

  const sorted = [...(exhibitions ?? [])].sort(
    (a, b) => new Date(b.startDate) - new Date(a.startDate)
  )

  return (
    <main className="exhibitions-page">
      <div className="page-hero-thin">
        <div className="page-container">
          <span className="section-label fade-up">Exhibitions</span>
          <h1 className="page-hero-thin__title fade-up delay-1">
            Where Stories<br /><em>Come to Life</em>
          </h1>
          <p className="page-hero-thin__desc fade-up delay-2">
            From intimate solo presentations to landmark surveys, our exhibition
            programme brings the depth and breadth of Aboriginal art into focus.
          </p>
        </div>
      </div>

      <div className="page-container">
        <div className="exhibitions-list">
          {sorted.map(ex => {
            const status = getStatus(ex)
            return (
              <Link
                to={`/exhibitions/${ex.id}`}
                key={ex.id}
                className={`exhibition-card exhibition-card--${status}`}
              >
                <div className="exhibition-card__img-wrap">
                  <img src={ex.coverImageUrl || FALLBACK} alt={ex.name} />
                </div>
                <div className="exhibition-card__body">
                  <span className={`exhibition-card__status exhibition-card__status--${status}`}>
                    {STATUS_LABEL[status]}
                  </span>
                  <h2 className="exhibition-card__title">{ex.name}</h2>
                  <p className="exhibition-card__dates">
                    {formatDate(ex.startDate)} — {formatDate(ex.endDate)}
                    {ex.location && <span className="exhibition-card__location"> · {ex.location}</span>}
                  </p>
                  {ex.description && (
                    <p className="exhibition-card__desc">
                      {ex.description.length > 160
                        ? ex.description.slice(0, 160) + '…'
                        : ex.description}
                    </p>
                  )}
                  <span className="exhibition-card__cta">View Exhibition →</span>
                </div>
              </Link>
            )
          })}
          {sorted.length === 0 && (
            <p style={{ color: 'var(--gray)', fontStyle: 'italic', padding: '60px 0' }}>
              No exhibitions available.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}