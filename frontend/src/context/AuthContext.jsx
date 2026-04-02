/**
 * Authentication Context
 *
 * Provides global authentication state (user, token, loading) and
 * methods (login, register, logout, updateUser) to all child components.
 * Persists the JWT token in localStorage and auto-loads the user profile on mount.
 *
 * @module context/AuthContext
 */

import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the component tree and manages authentication state.
 * On mount, it attempts to load the user profile from a persisted JWT token.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  /* Load user profile from the stored token on initial mount */
  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
        } catch {
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  /** Authenticate and store the token and user data */
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
    return userData;
  };

  /** Register a new user account */
  const register = async (data) => {
    await api.post('/auth/register', data);
  };

  /** Clear authentication state and remove the stored token */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  /** Merge partial user data into the current user state */
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access the authentication context.
 * Must be used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
