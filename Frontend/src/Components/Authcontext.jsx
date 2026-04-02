import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { userApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)       // CurrentUserDto from /api/user/me
  const [loading, setLoading] = useState(true) // initial check

  // Try to fetch the current user on mount (cookie may already exist)
  const fetchMe = useCallback(async () => {
    try {
      const me = await userApi.me()
      setUser(me)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  // Called after OTP verification succeeds (cookie is set by server)
  const onLoginSuccess = useCallback(() => {
    fetchMe()
  }, [fetchMe])

  const logout = useCallback(() => {
    // Cookie is HttpOnly — we can't clear it from JS.
    // Ask the backend to clear it, or just remove user state.
    // If your backend has a /api/auth/logout endpoint, call it here.
    setUser(null)
    // Optionally: fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, onLoginSuccess, logout, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}