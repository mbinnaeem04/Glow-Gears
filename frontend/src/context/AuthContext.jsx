import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest, TOKEN_KEY } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setUser(null);
      setLoading(false);
      return null;
    }
    try {
      const data = await apiRequest('/api/auth/me');
      setUser(data.user || null);
      return data.user || null;
    } catch (error) {
      if (error.status !== 401) console.error('Could not refresh account:', error.message);
      if (error.status === 401) localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = useCallback(async (email, password) => {
    const data = await apiRequest('/api/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user || null);
    return data.user;
  }, []);

  const signup = useCallback(async (email, password, displayName) => {
    const data = await apiRequest('/api/auth/signup', { method: 'POST', body: { email, password, displayName } });
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user || null);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (changes) => {
    const data = await apiRequest('/api/auth/me', { method: 'PATCH', body: changes });
    setUser(data.user || null);
    return data.user;
  }, []);

  const value = useMemo(() => ({
    user,
    role: user?.role || null,
    loading,
    isLoading: loading,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
  }), [user, loading, login, signup, logout, updateProfile, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
