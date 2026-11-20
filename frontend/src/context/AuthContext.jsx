import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Only load user if explicitly stored in localStorage; otherwise user is null (must sign in)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ecotrack_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.ecoPoints !== 'number') {
        parsed.ecoPoints = parsed.role === 'admin' ? 1200 : 400;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('ecotrack_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync state to localStorage immediately
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

  const updateEcoPoints = async (newPoints) => {
    const numericPoints = Math.max(0, Math.round(Number(newPoints)));
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ecoPoints: numericPoints };
      localStorage.setItem('ecotrack_user', JSON.stringify(updated));
      return updated;
    });

    try {
      await api.user.updatePoints({ ecoPoints: numericPoints });
    } catch (err) {
      console.warn('[AuthContext] Background points sync:', err);
    }
  };

  const addEcoPoints = async (delta) => {
    const numericDelta = Number(delta) || 0;
    const current = (user && typeof user.ecoPoints === 'number') ? user.ecoPoints : 400;
    return updateEcoPoints(current + numericDelta);
  };

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email.trim().toLowerCase(), password);
      // Ensure ecoPoints is numeric
      const loggedUser = {
        ...data.user,
        ecoPoints: typeof data.user?.ecoPoints === 'number' ? data.user.ecoPoints : (data.user?.role === 'admin' ? 1200 : 400)
      };
      setUser(loggedUser);
      setToken(data.token);
      localStorage.setItem('ecotrack_user', JSON.stringify(loggedUser));
      localStorage.setItem('ecotrack_token', data.token);
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
      const signedUser = {
        ...data.user,
        ecoPoints: typeof data.user?.ecoPoints === 'number' ? data.user.ecoPoints : 100
      };
      setUser(signedUser);
      setToken(data.token);
      localStorage.setItem('ecotrack_user', JSON.stringify(signedUser));
      localStorage.setItem('ecotrack_token', data.token);
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
    localStorage.removeItem('ecotrack_user');
    localStorage.removeItem('ecotrack_token');
  };

  const refreshProfile = async () => {
    try {
      const res = await api.user.getProfile();
      if (res.data?.user) {
        setUser((prev) => {
          if (!prev) return res.data.user;
          // Prefer local ecoPoints if explicitly preserved, or take profile points
          const currentPts = typeof prev.ecoPoints === 'number' ? prev.ecoPoints : res.data.user.ecoPoints;
          const merged = { ...prev, ...res.data.user, ecoPoints: currentPts ?? res.data.user.ecoPoints ?? 400 };
          localStorage.setItem('ecotrack_user', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (e) {
      // Offline / fallback silently
    }
  };

  const currentPoints = typeof user?.ecoPoints === 'number' 
    ? user.ecoPoints 
    : (user?.role === 'admin' ? 1200 : 400);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        ecoPoints: currentPoints,
        updateEcoPoints,
        addEcoPoints,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin' || user?.email === 'admin@ecotrack.org' || user?.email === 'admin@ecotrack.com',
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
