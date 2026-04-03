import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signin.css";

export default function Signin() {
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    // TODO: connect your registration API here
    navigate("/home");
  };

  return (
    <div className="auth-page">
      <div className="auth-bg" />

      <Link to="/welcome" className="auth-back">
        ← &nbsp;Back
      </Link>

      <div className="auth-container">
        <div className="auth-card fade-up">

          <div className="auth-card__top">
            <span className="section-label">Kala Sangam Gallery</span>
            <h1 className="auth-card__title">Create Account</h1>
            <p className="auth-card__subtitle">
              Join the Ngurini. Explore art, connect with artists.
            </p>
          </div>

          <div className="auth-card__divider" />

          <form className="auth-form" onSubmit={handleSubmit} noValidate>

            <div className="auth-field">
              <label className="auth-label" htmlFor="name">Full Name</label>
              <input
                className="auth-input"
                type="text"
                id="name"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email Address</label>
              <input
                className="auth-input"
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <input
                className="auth-input"
                type="password"
                id="password"
                name="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm">Confirm Password</label>
              <input
                className="auth-input"
                type="password"
                id="confirm"
                name="confirm"
                placeholder="••••••••"
                value={form.confirm}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="auth-submit" type="submit">
              Create Account
            </button>

          </form>
          {/* OAuth divider */}
<div className="auth-page__oauth-divider">
  <span>or continue with</span>
</div>

{/* Google OAuth button */}
<button
  type="button"
  className="auth-page__oauth-btn"
  onClick={() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5126'
    window.location.href = `${apiUrl}/api/auth/google`
  }}
>
  <svg className="auth-page__oauth-icon" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
  Continue with Google
</button>

          <p className="auth-switch">
            Already have an account?{" "}
            <Link to="/login" className="auth-switch__link">Sign in</Link>
          </p>

        </div>
      </div>
    </div>
  );
}
