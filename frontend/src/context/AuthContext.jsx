import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Only load user if explicitly stored in localStorage; otherwise user is null (must sign in)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecotrack_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('ecotrack_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('ecotrack_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecotrack_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ecotrack_token', token);
    } else {
      localStorage.removeItem('ecotrack_token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email.trim().toLowerCase(), password);
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const signup = async (userData) => {
    try {
      const data = await api.auth.signup({
        ...userData,
        email: userData.email.trim().toLowerCase()
      });
      setUser(data.user);
      setToken(data.token);
      setIsAuthModalOpen(false);
      return data;
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    api.auth.logout();
    setUser(null);
    setToken(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await api.user.getProfile();
      if (res.data?.user) {
        setUser(res.data.user);
      }
    } catch (e) {
      // Offline / fallback silently
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin' || user?.email === 'admin@ecotrack.com',
        login,
        signup,
        logout,
        refreshProfile,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
