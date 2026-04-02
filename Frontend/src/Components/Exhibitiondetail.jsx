// pages/ExhibitionDetail.jsx
import { useParams, Link } from 'react-router-dom'
import { exhibitionsApi } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './ExhibitionDetail.css'

const FALLBACK_COVER = 'https://images.unsplash.com/photo-1531243269054-1c6a7b70af21?w=1600&q=80'
const FALLBACK_ART   = 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80'

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function ExhibitionDetail() {
  const { id } = useParams()

  const { data: exhibition, loading, error, refetch } = useFetch(
    () => exhibitionsApi.getById(id), [id]
  )

  if (loading) return <LoadingSpinner message="Loading exhibition…" />
  if (error)   return <ErrorMessage message={error} onRetry={refetch} />
  if (!exhibition) return <ErrorMessage message="Exhibition not found." />

  // The backend's getExhibitionById should return an `artifacts` array on the DTO.
  // If your ExhibitionDto doesn't include artifacts, this gracefully falls back to [].
  const works = exhibition.artifacts ?? []

  return (
    <main className="exhibition-detail">
      {/* Hero */}
      <div className="exhibition-detail__hero">
        <img
          src={exhibition.coverImageUrl || FALLBACK_COVER}
          alt={exhibition.name}
          className="exhibition-detail__hero-img"
        />
        <div className="exhibition-detail__hero-overlay" />
        <div className="exhibition-detail__hero-content">
          <Link to="/exhibitions" className="back-link">← All Exhibitions</Link>
          <span className="section-label" style={{ color: 'rgba(212,175,106,0.9)' }}>
            {new Date(exhibition.startDate) > new Date() ? 'Upcoming' : 'Exhibition'}
          </span>
          <h1 className="exhibition-detail__title">{exhibition.name}</h1>
          <p className="exhibition-detail__dates">
            {formatDate(exhibition.startDate)} — {formatDate(exhibition.endDate)}
            {exhibition.location && (
              <><span className="hero__dot"> · </span>{exhibition.location}</>
            )}
          </p>
        </div>
      </div>

      <div className="page-container">
        <div className="exhibition-detail__body">
          {/* Description */}
          {exhibition.description && (
            <div className="exhibition-detail__description">
              <span className="section-label">About</span>
              <p>{exhibition.description}</p>
            </div>
          )}

          {/* Works in this exhibition */}
          {works.length > 0 && (
            <div className="exhibition-detail__works">
              <div className="section-header">
                <span className="section-label">Works in this Exhibition</span>
              </div>
              <div className="exhibition-works-grid">
                {works.map(work => (
                  <Link to={`/artifacts/${work.id}`} key={work.id} className="exhibition-work-card">
                    <div className="exhibition-work-card__img-wrap">
                      <img src={work.imageUrl || FALLBACK_ART} alt={work.title} />
                    </div>
                    <div className="exhibition-work-card__info">
                      <div className="exhibition-work-card__title">{work.title}</div>
                      <div className="exhibition-work-card__meta">
                        {work.artistFirstName} {work.artistLastName}
                        {work.yearCreated && ` · ${work.yearCreated}`}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}