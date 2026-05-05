// Components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  const isHome = location.pathname === '/';
  
  const links = [
    { to: '/artists', label: 'Artists' },
    { to: '/artifacts', label: 'Collection' },
    { to: '/exhibitions', label: 'Exhibitions' },
    { to: '/community', label: 'Community' },
    { to: '/contact', label: 'Contact' },
  ];

  // Add admin link for admin users
  const adminLink = user?.role === 'Admin' ? [{ to: '/admin', label: 'Admin' }] : [];
  const allLinks = [...links, ...adminLink];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled || !isHome ? 'navbar--solid' : ''} ${menuOpen ? 'navbar--open' : ''}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-text">aborginal art gallery</span>
          <span className="navbar__logo-sub">{'\u00A0'}</span>
        </Link>

        <div className="navbar__links">
          {allLinks.map(l => (
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
                  <button className="navbar__user-menu-logout" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar__cta">Sign In</Link>
          )}
        </div>

        <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>
      </div>

      <div className={`navbar__mobile ${menuOpen ? 'open' : ''}`}>
        {allLinks.map(l => (
          <Link key={l.to} to={l.to} className="navbar__mobile-link">{l.label}</Link>
        ))}
        {user ? (
          <button className="navbar__mobile-link" onClick={handleLogout}>
            Sign Out ({user.firstName})
          </button>
        ) : (
          <Link to="/login" className="navbar__mobile-link">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
