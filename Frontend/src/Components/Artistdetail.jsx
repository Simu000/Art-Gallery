import { useParams, Link } from 'react-router-dom'
import { artistsApi, artifactsApi } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './ArtistDetail.css'

const FALLBACK_ARTIST = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80'
const FALLBACK_ART = 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80'

export default function ArtistDetail() {
  const { id } = useParams()

  const { data: artist, loading: aLoading, error: aError, refetch } = useFetch(
    () => artistsApi.getById(id), [id]
  )
  const { data: allArtifacts, loading: arLoading } = useFetch(artifactsApi.getAll)

  if (aLoading || arLoading) return <LoadingSpinner message="Loading artist…" />
  if (aError) return <ErrorMessage message={aError} onRetry={refetch} />
  if (!artist) return <ErrorMessage message="Artist not found." />

  // Filter artifacts by this artist
  const works = allArtifacts?.filter(a => a.artistId === Number(id)) ?? []

  return (
    <main className="artist-detail">
      <div className="artist-detail__hero">
        <div className="artist-detail__hero-img-wrap">
          <img src={artist.photoUrl || FALLBACK_ARTIST} alt={`${artist.firstName} ${artist.lastName}`} />
          <div className="artist-detail__hero-overlay" />
        </div>
        <div className="artist-detail__hero-content">
          <Link to="/artists" className="back-link">← All Artists</Link>
          <div className="artist-detail__hero-tribe">{artist.country}</div>
          <h1 className="artist-detail__hero-name">{artist.firstName} {artist.lastName}</h1>
          <div className="artist-detail__hero-region">b. {artist.birthYear}</div>
        </div>
      </div>

      <div className="page-container">
        <div className="artist-detail__body">
          <div className="artist-detail__bio-col">
            <span className="section-label">Biography</span>
            <p className="artist-detail__bio">{artist.bio || 'No biography available.'}</p>
            <div className="artist-detail__tags">
              <div className="artist-tag">
                <span className="artist-tag__label">Country</span>
                <span className="artist-tag__value">{artist.country || 'Australia'}</span>
              </div>
              <div className="artist-tag">
                <span className="artist-tag__label">Born</span>
                <span className="artist-tag__value">{artist.birthYear || '—'}</span>
              </div>
              <div className="artist-tag">
                <span className="artist-tag__label">Works in Collection</span>
                <span className="artist-tag__value">{works.length}</span>
              </div>
            </div>
          </div>

          <div className="artist-detail__works-col">
            <span className="section-label">Works in Collection</span>
            {works.length > 0 ? (
              <div className="artist-works-grid">
                {works.map(work => (
                  <Link to={`/artifacts/${work.id}`} key={work.id} className="artist-work-card">
                    <div className="artist-work-card__img-wrap">
                      <img src={work.imageUrl || FALLBACK_ART} alt={work.title} />
                    </div>
                    <div className="artist-work-card__info">
                      <div className="artist-work-card__title">{work.title}</div>
                      <div className="artist-work-card__year">
                        {work.yearCreated} · {work.medium}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="artist-detail__no-works">No works currently in the online collection.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}