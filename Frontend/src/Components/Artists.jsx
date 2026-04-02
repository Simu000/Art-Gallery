import { useState } from 'react'
import { Link } from 'react-router-dom'
import { artistsApi } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import './Artists.css'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80'

export default function Artists() {
  const [hovered, setHovered] = useState(null)
  const { data: artists, loading, error, refetch } = useFetch(artistsApi.getAll)

  if (loading) return <LoadingSpinner message="Loading artists…" />
  if (error) return <ErrorMessage message={error} onRetry={refetch} />

  return (
    <main className="artists-page">
      <div className="page-hero-thin">
        <div className="page-container">
          <span className="section-label fade-up">Our Artists</span>
          <h1 className="page-hero-thin__title fade-up delay-1">
            The Custodians<br /><em>of Country</em>
          </h1>
          <p className="page-hero-thin__desc fade-up delay-2">
            We represent artists whose practice is inseparable from the land,
            the Dreaming, and the community — working only with artists and
            families who have given their consent and blessing.
          </p>
        </div>
      </div>

      {/* List view */}
      <section className="artists-list">
        <div className="page-container">
          {artists?.map((artist, i) => (
            <Link
              to={`/artists/${artist.id}`}
              key={artist.id}
              className={`artist-row ${hovered === artist.id ? 'hovered' : ''} ${hovered && hovered !== artist.id ? 'dimmed' : ''}`}
              onMouseEnter={() => setHovered(artist.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="artist-row__num">{String(i + 1).padStart(2, '0')}</div>
              <div className="artist-row__img-wrap">
                <img src={artist.photoUrl || FALLBACK_IMG} alt={`${artist.firstName} ${artist.lastName}`} className="artist-row__img" />
              </div>
              <div className="artist-row__info">
                <div className="artist-row__name">{artist.firstName} {artist.lastName}</div>
                <div className="artist-row__tribe">{artist.country}</div>
              </div>
              <div className="artist-row__meta">
                <div className="artist-row__region">b. {artist.birthYear}</div>
                <div className="artist-row__specialty" style={{ fontStyle: 'italic' }}>{artist.bio?.slice(0, 60)}…</div>
              </div>
              <div className="artist-row__arrow">→</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mosaic grid */}
      <section className="artists-grid-section">
        <div className="page-container">
          <div className="section-header">
            <span className="section-label">Gallery View</span>
          </div>
          <div className="artists-mosaic">
            {artists?.map(artist => (
              <Link to={`/artists/${artist.id}`} key={artist.id} className="mosaic-card">
                <div className="mosaic-card__img-wrap">
                  <img src={artist.photoUrl || FALLBACK_IMG} alt={`${artist.firstName} ${artist.lastName}`} />
                  <div className="mosaic-card__overlay">
                    <div className="mosaic-card__info">
                      <div className="mosaic-card__name">{artist.firstName} {artist.lastName}</div>
                      <div className="mosaic-card__tribe">{artist.country}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}