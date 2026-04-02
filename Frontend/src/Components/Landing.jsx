// Components/Landing.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  // If user is already logged in, redirect to home
  if (user) {
    navigate('/home');
    return null;
  }

  return (
    <div className="landing">
      {/* Background Video/Image */}
      <div className="landing__bg">
        <div className="landing__overlay"></div>
        <img 
          src="https://images.unsplash.com/photo-1531243269054-1c6a7b70af21?w=1600&q=80" 
          alt="Aboriginal Art Background"
          className="landing__bg-img"
        />
      </div>

      {/* Main Content */}
      <div className="landing__content">
        <div className="landing__header">
          <div className="landing__logo">Ngurini</div>
          <div className="landing__logo-sub">Aboriginal Art Gallery</div>
        </div>

        <div className="landing__hero">
          <h1 className="landing__title">
            Where Ancient Stories<br />
            <span className="landing__title-highlight">Come to Life</span>
          </h1>
          <p className="landing__subtitle">
            Experience the world's oldest living artistic tradition — 
            a journey through country, culture, and connection.
          </p>
        </div>

        <div className="landing__actions">
          <button 
            className="landing__btn landing__btn--primary"
            onClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
          >
            Sign In
          </button>
          <button 
            className="landing__btn landing__btn--secondary"
            onClick={() => {
              setAuthMode('register');
              setShowAuthModal(true);
            }}
          >
            Create Account
          </button>
        </div>

        <div className="landing__features">
          <div className="landing__feature">
            <div className="landing__feature-icon">🎨</div>
            <div className="landing__feature-text">Curated Collection</div>
          </div>
          <div className="landing__feature">
            <div className="landing__feature-icon">🖼️</div>
            <div className="landing__feature-text">Indigenous Artists</div>
          </div>
          <div className="landing__feature">
            <div className="landing__feature-icon">🏛️</div>
            <div className="landing__feature-text">Exhibitions</div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <LandingAuthModal 
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            navigate('/home');
          }}
        />
      )}
    </div>
  );
}

// Separate Auth Modal Component for Landing Page
function LandingAuthModal({ mode, onClose, onSuccess }) {
  const [step, setStep] = useState(mode);
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    firstName: '', 
    lastName: '', 
    otp: '' 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { onLoginSuccess } = useAuth();

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5126/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      setMessage('Check your email for the verification code.');
      setStep('otp-login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5126/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      setMessage('Verification code sent to your email.');
      setStep('otp-register');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = step === 'otp-login' 
        ? '/api/auth/verify-otp-login' 
        : '/api/auth/verify-otp-registration';
      
      const response = await fetch(`http://localhost:5126${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: form.email, otp: form.otp })
      });
      
      if (!response.ok) throw new Error('Invalid or expired code');
      
      await onLoginSuccess();
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="landing-modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="landing-modal__content">
        <button className="landing-modal__close" onClick={onClose}>✕</button>

        {(step === 'otp-login' || step === 'otp-register') && (
          <form onSubmit={handleVerifyOtp}>
            <div className="landing-modal__logo">Ngurini</div>
            <h2 className="landing-modal__title">Verify Your Email</h2>
            <p className="landing-modal__message">{message}</p>
            
            <div className="landing-modal__input-group">
              <label>Verification Code</label>
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={form.otp}
                onChange={set('otp')}
                maxLength={6}
                required
              />
            </div>
            
            {error && <div className="landing-modal__error">{error}</div>}
            
            <button type="submit" className="landing-modal__submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            
            <button type="button" className="landing-modal__back" onClick={() => setStep(step === 'otp-login' ? 'login' : 'register')}>
              ← Back
            </button>
          </form>
        )}

        {step === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="landing-modal__logo">Ngurini</div>
            <h2 className="landing-modal__title">Welcome Back</h2>
            <p className="landing-modal__message">Sign in to continue</p>
            
            <div className="landing-modal__input-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            
            <div className="landing-modal__input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />
            </div>
            
            {error && <div className="landing-modal__error">{error}</div>}
            
            <button type="submit" className="landing-modal__submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <p className="landing-modal__switch">
              Don't have an account?{' '}
              <button type="button" onClick={() => { setStep('register'); setError(''); }}>
                Create one
              </button>
            </p>
          </form>
        )}

        {step === 'register' && (
          <form onSubmit={handleRegister}>
            <div className="landing-modal__logo">Ngurini</div>
            <h2 className="landing-modal__title">Create Account</h2>
            <p className="landing-modal__message">Join our community</p>
            
            <div className="landing-modal__row">
              <div className="landing-modal__input-group">
                <label>First Name</label>
                <input type="text" placeholder="Jane" value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div className="landing-modal__input-group">
                <label>Last Name</label>
                <input type="text" placeholder="Smith" value={form.lastName} onChange={set('lastName')} required />
              </div>
            </div>
            
            <div className="landing-modal__input-group">
              <label>Email</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            
            <div className="landing-modal__input-group">
              <label>Password</label>
              <input type="password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} required />
            </div>
            
            {error && <div className="landing-modal__error">{error}</div>}
            
            <button type="submit" className="landing-modal__submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
            
            <p className="landing-modal__switch">
              Already have an account?{' '}
              <button type="button" onClick={() => { setStep('login'); setError(''); }}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}