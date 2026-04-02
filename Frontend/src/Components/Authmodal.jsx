// components/AuthModal.jsx
import { useState } from 'react'
import { auth } from '../api/client'
import { useAuth } from '../context/AuthContext'
import './AuthModal.css'

/**
 * AuthModal
 * Props:
 *   onClose — called when the modal should close
 */
export default function AuthModal({ onClose }) {
  // step: 'login' | 'register' | 'otp-login' | 'otp-register'
  const [step, setStep]       = useState('login')
  const [form, setForm]       = useState({ email: '', password: '', firstName: '', lastName: '', otp: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [message, setMessage] = useState('')
  const { onLoginSuccess }    = useAuth()

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  // ── Login: POST /api/auth/login ──────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.login({ email: form.email, password: form.password })
      setMessage('Check your email for a one-time code.')
      setStep('otp-login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Register: POST /api/auth/register ────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.register({
        email:     form.email,
        password:  form.password,
        firstName: form.firstName,
        lastName:  form.lastName,
      })
      setMessage('We sent a verification code to your email.')
      setStep('otp-register')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // ── Verify OTP ───────────────────────────────────────────────────────────
  // POST /api/auth/verify-otp-login  OR  /api/auth/verify-otp-registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (step === 'otp-login') {
        await auth.verifyOtpLogin({ email: form.email, otp: form.otp })
      } else {
        await auth.verifyOtpRegistration({ email: form.email, otp: form.otp })
      }
      // Server has set the JWT cookie — reload current user then close modal
      await onLoginSuccess()
      onClose()
    } catch {
      setError('Invalid or expired code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal__close" onClick={onClose}>✕</button>

        {/* ── OTP verification step ─────────────────────────────────────── */}
        {(step === 'otp-login' || step === 'otp-register') && (
          <form className="modal__form" onSubmit={handleVerifyOtp}>
            <div className="modal__logo">Ngurini</div>
            <h2 className="modal__title">Verify your email</h2>
            <p className="modal__sub">{message}</p>

            <label className="modal__label">One-time code</label>
            <input
              className="modal__input"
              type="text"
              placeholder="123456"
              value={form.otp}
              onChange={set('otp')}
              required
              maxLength={8}
              autoFocus
            />

            {error && <p className="modal__error">{error}</p>}

            <button className="modal__submit" type="submit" disabled={loading}>
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </button>

            <button
              type="button"
              className="modal__switch"
              onClick={() => { setStep(step === 'otp-login' ? 'login' : 'register'); setError('') }}
            >
              ← Back
            </button>
          </form>
        )}

        {/* ── Login step ───────────────────────────────────────────────── */}
        {step === 'login' && (
          <form className="modal__form" onSubmit={handleLogin}>
            <div className="modal__logo">Ngurini</div>
            <h2 className="modal__title">Welcome back</h2>
            <p className="modal__sub">Sign in to your account</p>

            <label className="modal__label">Email</label>
            <input className="modal__input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />

            <label className="modal__label">Password</label>
            <input className="modal__input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />

            {error && <p className="modal__error">{error}</p>}

            <button className="modal__submit" type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Continue'}
            </button>

            <p className="modal__switch">
              No account?{' '}
              <button type="button" className="modal__switch-link" onClick={() => { setStep('register'); setError('') }}>
                Create one
              </button>
            </p>
          </form>
        )}

        {/* ── Register step ────────────────────────────────────────────── */}
        {step === 'register' && (
          <form className="modal__form" onSubmit={handleRegister}>
            <div className="modal__logo">Ngurini</div>
            <h2 className="modal__title">Create an account</h2>
            <p className="modal__sub">Join our community of art lovers</p>

            <div className="modal__row">
              <div>
                <label className="modal__label">First name</label>
                <input className="modal__input" type="text" placeholder="Jane" value={form.firstName} onChange={set('firstName')} required />
              </div>
              <div>
                <label className="modal__label">Last name</label>
                <input className="modal__input" type="text" placeholder="Smith" value={form.lastName} onChange={set('lastName')} required />
              </div>
            </div>

            <label className="modal__label">Email</label>
            <input className="modal__input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />

            <label className="modal__label">Password</label>
            <input className="modal__input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required />

            {error && <p className="modal__error">{error}</p>}

            <button className="modal__submit" type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="modal__switch">
              Already have an account?{' '}
              <button type="button" className="modal__switch-link" onClick={() => { setStep('login'); setError('') }}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}