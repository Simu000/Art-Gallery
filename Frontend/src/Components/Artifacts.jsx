// Components/Artifacts.jsx
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { artifactsApi } from '../api/client';
import { useFetch } from '../hooks/useFetch';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import './Artifacts.css';

const FALLBACK = 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=800&q=80';

export default function Artifacts() {
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  const { data: artifacts, loading, error, refetch } = useFetch(artifactsApi.getAll);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const results = await artifactsApi.search(searchQuery);
        setSearchResults(results);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  if (loading) return <LoadingSpinner message="Loading collection..." />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  const displayed = searchResults ?? artifacts ?? [];

  return (
    <main className="artifacts-page">
      <div className="page-hero-thin">
        <div className="page-container">
          <span className="section-label fade-up">Collection</span>
          <h1 className="page-hero-thin__title fade-up delay-1">
            Works of<br /><em>Extraordinary Power</em>
          </h1>
          <p className="page-hero-thin__desc fade-up delay-2">
            A curated collection spanning the founding years of contemporary
            Aboriginal art to the vibrant present. Each work carries within it
            a story of country, ceremony, and ancestral connection.
          </p>
        </div>
      </div>

      <div className="artifacts-toolbar">
        <div className="page-container">
          <div className="artifacts-toolbar__inner">
            <div className="artifacts-search-wrap">
              <span className="artifacts-search-icon">⌕</span>
              <input
                className="artifacts-search"
                type="text"
                placeholder="Search works, artists, media..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="artifacts-search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>

            <div className="artifacts-view-toggle">
              <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>⊞</button>
              <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>☰</button>
              <span className="artifacts-count">
                {searching ? '...' : `${displayed.length} works`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {searching && <LoadingSpinner message="Searching..." />}

      {!searching && displayed.length === 0 && (
        <div className="page-container" style={{ padding: '80px 60px', color: 'var(--gray)', fontStyle: 'italic' }}>
          No works found{searchQuery ? ` for "${searchQuery}"` : ''}.
        </div>
      )}

      {!searching && view === 'grid' && displayed.length > 0 && (
        <section className="artifacts-grid-section">
          <div className="page-container">
            <div className="artifacts-grid">
              {displayed.map((art, i) => (
                <Link
                  to={`/artifacts/${art.id}`}
                  key={art.id}
                  className={`artifact-card ${i % 5 === 0 ? 'artifact-card--tall' : ''}`}
                >
                  <div className="artifact-card__img-wrap">
                    <img src={art.imageUrl || FALLBACK} alt={art.title} />
                    <div className="artifact-card__hover">
                      <div className="artifact-card__hover-content">
                        <div className="artifact-card__hover-medium">{art.medium}</div>
                        <div className="artifact-card__hover-dim">{art.yearCreated}</div>
                        <div className="artifact-card__hover-cta">View Work →</div>
                      </div>
                    </div>
                  </div>
                  <div className="artifact-card__footer">
                    <div>
                      <div className="artifact-card__title">{art.title}</div>
                      <div className="artifact-card__artist">
                        {art.yearCreated}
                      </div>
                    </div>
                    <div className="artifact-card__type">{art.medium?.split(' ')[0]}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}