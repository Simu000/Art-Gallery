// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const me = await userApi.me();
      setUser(me);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const onLoginSuccess = useCallback(async () => {
    await fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await fetch('http://localhost:5126/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // endpoint may not exist yet
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, onLoginSuccess, logout, refetch: fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}