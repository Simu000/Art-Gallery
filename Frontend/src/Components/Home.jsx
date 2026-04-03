import { Link } from 'react-router-dom'
import { exhibitionsApi, artistsApi, artifactsApi } from '../api/client'
import { useFetch } from '../hooks/useFetch'
import LoadingSpinner from './Loadingspinner'
import './Home.css'

export default function Home() {
  const { data: exhibitions, loading: exLoading } = useFetch(exhibitionsApi.getAll)
  const { data: artists, loading: arLoading } = useFetch(artistsApi.getAll)
  const { data: artifacts, loading: artLoading } = useFetch(artifactsApi.getAll)

  if (exLoading || arLoading || artLoading) return <LoadingSpinner message="Loading gallery…" />

  // Determine current/upcoming from dates
  const now = new Date()
  const currentExhibition = exhibitions?.find(e =>
    new Date(e.startDate) <= now && new Date(e.endDate) >= now
  ) || exhibitions?.[0]

  const upcomingExhibition = exhibitions?.find(e => new Date(e.startDate) > now)

  const featuredArtists = artists?.slice(0, 3) ?? []
  const featuredArtworks = artifacts?.slice(0, 4) ?? []

  if (!currentExhibition) return null

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg">
          <img
            src={currentExhibition.coverImageUrl || 'https://images.unsplash.com/photo-1531243269054-1c6a7b70af21?w=1600&q=80'}
            alt="hero"
            className="hero__img"
          />
          <div className="hero__overlay" />
        </div>
        <div className="hero__content">
          <div className="fade-up">
            <span className="section-label" style={{ color: 'rgba(212,175,106,0.9)' }}>Currently Showing</span>
          </div>
          <h1 className="hero__title fade-up delay-1">{currentExhibition.name}</h1>
          <p className="hero__subtitle fade-up delay-2">{currentExhibition.description}</p>
          <p className="hero__meta fade-up delay-2">
            {formatDate(currentExhibition.startDate)} — {formatDate(currentExhibition.endDate)}
            {currentExhibition.location && (
              <><span className="hero__dot">·</span>{currentExhibition.location}</>
            )}
          </p>
          <div className="hero__actions fade-up delay-3">
            <Link to={`/exhibitions/${currentExhibition.id}`} className="btn btn--primary">
              Explore Exhibition
            </Link>
            <Link to="/exhibitions" className="btn btn--ghost">
              All Exhibitions
            </Link>
          </div>
        </div>
        <div className="hero__scroll">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* Stats bar */}
      <section className="stats">
        <div className="page-container">
          <div className="stats__grid">
            {[
              { num: `${artifacts?.length ?? '—'}`, label: 'Works in Collection' },
              { num: `${artists?.length ?? '—'}`, label: 'Featured Artists' },
              { num: `${exhibitions?.length ?? '—'}`, label: 'Exhibitions' },
              { num: '40+', label: 'Years of Collection' },
            ].map((s, i) => (
              <div key={i} className="stats__item">
                <div className="stats__num">{s.num}</div>
                <div className="stats__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About strip */}
      <section className="about-strip">
        <div className="page-container">
          <div className="about-strip__inner">
            <div className="about-strip__left">
              <span className="section-label">About Ngurini</span>
              <h2 className="about-strip__heading">
                A space where the<br />
                <em>world's oldest stories</em><br />
                find new voices.
              </h2>
            </div>
            <div className="about-strip__right">
              <p>
                Ngurini — meaning "to look, to see" in Anangu — is dedicated to presenting
                Aboriginal art with the depth, context, and care it deserves. We work directly
                with artists and communities to build a collection that is both extraordinary
                and ethically grounded.
              </p>
              <p>
                Our galleries bring together historic works from the Papunya Tula movement
                alongside the most exciting contemporary voices reshaping Aboriginal art today.
              </p>
              <Link to="/artists" className="text-link">
                Meet the Artists <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists */}
      {featuredArtists.length > 0 && (
        <section className="featured-artists">
          <div className="page-container">
            <div className="section-header">
              <span className="section-label">Featured Artists</span>
              <Link to="/artists" className="section-see-all">View All Artists →</Link>
            </div>
            <div className="artists-row">
              {featuredArtists.map(artist => (
                <Link to={`/artists/${artist.id}`} key={artist.id} className="artist-card">
                  <div className="artist-card__img-wrap">
                    <img
                      src={artist.photoUrl || `https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80`}
                      alt={`${artist.firstName} ${artist.lastName}`}
                      className="artist-card__img"
                    />
                    <div className="artist-card__overlay">
                      <span className="artist-card__view">View Artist →</span>
                    </div>
                  </div>
                  <div className="artist-card__info">
                    <div className="artist-card__name">{artist.firstName} {artist.lastName}</div>
                    <div className="artist-card__tribe">{artist.country}</div>
                    <div className="artist-card__region">b. {artist.birthYear}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Collection preview */}
      {featuredArtworks.length > 0 && (
        <section className="collection-preview">
          <div className="page-container">
            <div className="section-header">
              <span className="section-label">From the Collection</span>
              <Link to="/artifacts" className="section-see-all">View Full Collection →</Link>
            </div>
            <div className="collection-grid">
              {featuredArtworks.map((art, i) => (
                <Link
                  to={`/artifacts/${art.id}`}
                  key={art.id}
                  className={`art-tile art-tile--${i % 3 === 0 ? 'large' : 'small'}`}
                >
                  <div className="art-tile__img-wrap">
                    <img
                      src={art.imageUrl || 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80'}
                      alt={art.title}
                      className="art-tile__img"
                    />
                    <div className="art-tile__hover">
                      <div className="art-tile__hover-title">{art.title}</div>
                      <div className="art-tile__hover-artist">
                        {art.artistFirstName} {art.artistLastName}, {art.yearCreated}
                      </div>
                      <div className="art-tile__hover-price">{art.medium}</div>
                    </div>
                  </div>
                  <div className="art-tile__caption">
                    <span className="art-tile__title">{art.title}</span>
                    <span className="art-tile__year">{art.yearCreated}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Exhibition CTA */}
      {upcomingExhibition && (
        <section className="exhibition-cta">
          <div className="page-container">
            <div className="exhibition-cta__inner">
              <div className="exhibition-cta__left">
                <span className="section-label" style={{ color: 'var(--gold)' }}>Upcoming</span>
                <h2 className="exhibition-cta__title">{upcomingExhibition.name}</h2>
                <p className="exhibition-cta__sub">{upcomingExhibition.description}</p>
                <Link to={`/exhibitions/${upcomingExhibition.id}`} className="btn btn--gold">
                  Learn More
                </Link>
              </div>
              <div className="exhibition-cta__right">
                <img
                  src={upcomingExhibition.coverImageUrl || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80'}
                  alt={upcomingExhibition.name}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function formatDate(str) {
  return new Date(str).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}