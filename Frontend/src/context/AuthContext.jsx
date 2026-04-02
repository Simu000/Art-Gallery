// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { userApi } from '../api/client'

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
   * Sign out: clear local user state.
   * Because the cookie is HttpOnly we cannot clear it from JS directly.
   * If your backend exposes POST /api/auth/logout, uncomment the fetch below.
   */
  const logout = useCallback(async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // endpoint may not exist yet — that's fine
    }
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