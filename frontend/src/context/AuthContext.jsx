import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ecotrack_user');
    return saved ? JSON.parse(saved) : {
      id: 'usr-1',
      name: 'Alex Johnson',
      email: 'user@ecotrack.org',
      mobile: '+1 (555) 234-5678',
      location: 'Greenwood District, Sector 4',
      ecoPoints: 350,
      role: 'citizen'
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('ecotrack_token') || 'demo-token');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('ecotrack_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ecotrack_user');
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      const data = await api.auth.login(email, password);
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
      const data = await api.auth.signup(userData);
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

  // Switch between Demo Citizen and Demo Officer for review
  const switchDemoRole = (role) => {
    if (role === 'admin') {
      const adminUser = {
        id: 'usr-admin',
        name: 'Officer Davis (Sanitation Lead)',
        email: 'admin@ecotrack.org',
        mobile: '+1 (555) 999-0001',
        location: 'Central Municipal Sanitation Office',
        ecoPoints: 1200,
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('ecotrack_user', JSON.stringify(adminUser));
    } else {
      const citizenUser = {
        id: 'usr-1',
        name: 'Alex Johnson',
        email: 'user@ecotrack.org',
        mobile: '+1 (555) 234-5678',
        location: 'Greenwood District, Sector 4',
        ecoPoints: 350,
        role: 'citizen'
      };
      setUser(citizenUser);
      localStorage.setItem('ecotrack_user', JSON.stringify(citizenUser));
    }
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
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        switchDemoRole,
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
