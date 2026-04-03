// context/AuthContext.jsx
// Place this file at: Frontend/src/context/AuthContext.jsx
// UPDATED: Added OAuth (Google) support via handleOAuthCallback

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { auth, userApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)   // CurrentUserDto from GET /api/user/me
  const [loading, setLoading] = useState(true)   // true during initial auth check

  // Try to load the logged-in user on mount (the JWT cookie may already exist)
  const fetchMe = useCallback(async () => {
    try {
      const me = await userApi.me()
      setUser(me)
    } catch {
      // 401 = not logged in, silently ignore
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  /**
   * Call this after OTP verification succeeds.
   * The server has set the HttpOnly JWT cookie; we just need to re-fetch /me.
   */
  const onLoginSuccess = useCallback(async () => {
    await fetchMe()
  }, [fetchMe])

  /**
   * Sign out: clear local user state and call the backend logout endpoint.
   * Because the cookie is HttpOnly we cannot clear it from JS directly.
   */
  const logout = useCallback(async () => {
    try {
      await auth.logout()
    } catch {
    }
    localStorage.clear()
    sessionStorage.clear()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, onLoginSuccess, logout, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}

/**
 * OAuthCallback component
 * -----------------------
 * Mount this at the route your Google OAuth redirect_uri points to.
 * e.g.  <Route path="/auth/callback" element={<OAuthCallback />} />
 *
 * Your backend should redirect to:
 *   /auth/callback?token=<jwt>        (if using URL-based token delivery)
 * OR simply set the HttpOnly cookie and redirect to:
 *   /auth/callback                    (cookie-based, preferred)
 *
 * Usage in App.jsx:
 *   import { OAuthCallback } from './context/AuthContext'
 *   <Route path="/auth/callback" element={<OAuthCallback />} />
 */
export function OAuthCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { onLoginSuccess } = useAuth()

  useEffect(() => {
    const run = async () => {
      /**
       * Optional: if your backend passes the JWT as a URL param instead of
       * setting a cookie, you can store it here. Most secure setups use
       * HttpOnly cookies — in that case the backend already set the cookie
       * before redirecting here and you just need to call fetchMe.
       *
       * Example URL-param handling (uncomment if needed):
       *
       * const token = searchParams.get('token')
       * if (token) {
       *   // Store token somewhere accessible to your api/client.js
       *   // (not localStorage for security; use a JS module-level variable
       *   //  or let the server set the cookie instead)
       * }
       */

      // Check for an error param from the OAuth provider
      const oauthError = searchParams.get('error')
      if (oauthError) {
        console.error('OAuth error:', oauthError)
        navigate('/login?error=oauth_failed', { replace: true })
        return
      }

      try {
        // The backend has already set the JWT cookie; just refresh the user
        await onLoginSuccess()
        navigate('/', { replace: true })
      } catch {
        navigate('/login?error=oauth_failed', { replace: true })
      }
    }

    run()
  }, [navigate, onLoginSuccess, searchParams])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--cream)',
      fontFamily: 'var(--font-body)',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        color: 'var(--gold)',
        letterSpacing: '0.06em',
      }}>
        Ngurini
      </div>
      <p style={{ fontSize: '13px', color: 'var(--gray)', letterSpacing: '0.1em' }}>
        Signing you in…
      </p>
    </div>
  )
}
