// Components/ArtistDetail.jsx
import { useParams, Link } from 'react-router-dom';
import { artistsApi, artifactsApi } from '../api/client';
import { useFetch } from '../hooks/useFetch';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './ArtistDetail.css';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80';

export default function ArtistDetail() {
  const { id } = useParams();

  const { data: artist, loading, error, refetch } = useFetch(
    () => artistsApi.getById(id),
    [id]
  );

  const { data: allArtifacts, loading: artifactsLoading } = useFetch(
    () => artifactsApi.getAll(),
    []
  );

  // Filter artworks for this artist
  const artworks = allArtifacts?.filter(art => art.artistId === parseInt(id, 10)) || [];

  if (loading) return <LoadingSpinner message="Loading artist..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;
  if (!artist) return <ErrorMessage message="Artist not found." />;

  return (
    <main className="artist-detail">
      <div className="artist-detail__hero">
        <div className="artist-detail__hero-img-wrap">
          <img 
            src={artist.photoUrl || FALLBACK_IMG}
            alt={`${artist.firstName} ${artist.lastName}`}
          />
          <div className="artist-detail__hero-overlay" />
        </div>
        <div className="artist-detail__hero-content">
          <Link to="/artists" className="back-link">← All Artists</Link>
          <div className="artist-detail__hero-tribe">{artist.country || 'Australia'}</div>
          <h1 className="artist-detail__hero-name">
            {artist.firstName} {artist.lastName}
          </h1>
          {artist.birthYear && (
            <div className="artist-detail__hero-region">b. {artist.birthYear}</div>
          )}
        </div>
      </div>

      <div className="page-container">
        <div className="artist-detail__body">
          <div className="artist-detail__bio-col">
            {artist.bio && (
              <>
                <span className="section-label">Biography</span>
                <p className="artist-detail__bio">{artist.bio}</p>
              </>
            )}
            <div className="artist-detail__tags">
              <div className="artist-tag">
                <span className="artist-tag__label">Country</span>
                <span className="artist-tag__value">{artist.country || 'Australia'}</span>
              </div>
              {artist.birthYear && (
                <div className="artist-tag">
                  <span className="artist-tag__label">Born</span>
                  <span className="artist-tag__value">{artist.birthYear}</span>
                </div>
              )}
            </div>
          </div>

          <div className="artist-detail__works-col">
            <span className="section-label">Artworks ({artworks.length})</span>
            {artifactsLoading && <LoadingSpinner message="Loading artworks..." />}
            {!artifactsLoading && artworks.length === 0 && (
              <p className="artist-detail__no-works">No artworks available for this artist.</p>
            )}
            <div className="artist-works-grid">
              {artworks.map(work => (
                <Link to={`/artifacts/${work.id}`} key={work.id} className="artist-work-card">
                  <div className="artist-work-card__img-wrap">
                    <img 
                      src={work.imageUrl || FALLBACK_IMG}
                      alt={work.title} 
                    />
                  </div>
                  <div className="artist-work-card__info">
                    <div className="artist-work-card__title">{work.title}</div>
                    <div className="artist-work-card__year">{work.yearCreated}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}