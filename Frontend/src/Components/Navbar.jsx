import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [location])

  const isHome = location.pathname === '/'
  const links = [
    { to: '/artists', label: 'Artists' },
    { to: '/artifacts', label: 'Collection' },
    { to: '/exhibitions', label: 'Exhibitions' },
    { to: '/community', label: 'Community' },
  ]

  return (
    <>
      <nav className={`navbar ${scrolled || !isHome ? 'navbar--solid' : ''} ${menuOpen ? 'navbar--open' : ''}`}>
        <div className="navbar__inner">
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-text">Ngurini</span>
            <span className="navbar__logo-sub">Aboriginal Art Gallery</span>
          </Link>

          <div className="navbar__links">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`navbar__link ${location.pathname.startsWith(l.to) ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            ))}

            {user ? (
              <div className="navbar__user" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                {user.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={user.firstName} className="navbar__avatar" />
                ) : (
                  <div className="navbar__avatar navbar__avatar--initials">
                    {user.firstName?.[0]}{user.lastName?.[0]}
                  </div>
                )}
                <span className="navbar__user-name">{user.firstName}</span>

                {userMenuOpen && (
                  <div className="navbar__user-menu">
                    <div className="navbar__user-menu-name">{user.firstName} {user.lastName}</div>
                    <div className="navbar__user-menu-email">{user.email}</div>
                    <div className="navbar__user-menu-role">{user.role}</div>
                    <button className="navbar__user-menu-logout" onClick={logout}>Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="navbar__cta" onClick={() => setAuthOpen(true)}>
                Sign In
              </button>
            )}
          </div>

          <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>

        <div className={`navbar__mobile ${menuOpen ? 'open' : ''}`}>
          {links.map(l => (
            <Link key={l.to} to={l.to} className="navbar__mobile-link">{l.label}</Link>
          ))}
          {user ? (
            <button
              className="navbar__mobile-link"
              style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)' }}
              onClick={logout}
            >
              Sign Out ({user.firstName})
            </button>
          ) : (
            <button
              className="navbar__mobile-link"
              style={{ textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              onClick={() => setAuthOpen(true)}
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </>
  )
}