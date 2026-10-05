// EcoTrack Stitch Integration Service
// Reusable service to connect Google Stitch components to the EcoTrack REST API backend.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Reusable fetch wrapper for EcoTrack API
 * Handles Authorization headers and x-user-id for Stitch prototyping and React components.
 */
export async function ecotrackFetch(endpoint, options = {}) {
  const token = localStorage.getItem('ecotrack_token');
  const user = JSON.parse(localStorage.getItem('ecotrack_user') || 'null');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(user ? { 'x-user-id': user.id } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || `Request failed with HTTP ${response.status}`);
  }

  return data.data;
}

/**
 * Authentication Helper for Stitch
 */
export const auth = {
  login: async (email, password) => {
    const data = await ecotrackFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem('ecotrack_token', data.token);
    localStorage.setItem('ecotrack_user', JSON.stringify(data.user));
    return data.user;
  },
  signup: async (userData) => {
    const data = await ecotrackFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    localStorage.setItem('ecotrack_token', data.token);
    localStorage.setItem('ecotrack_user', JSON.stringify(data.user));
    return data.user;
  },
  logout: () => {
    localStorage.removeItem('ecotrack_token');
    localStorage.removeItem('ecotrack_user');
  }
};

/**
 * Dashboard Helper for Stitch
 */
export const getDashboardStats = () => ecotrackFetch('/dashboard/stats');

/**
 * Reports Helper for Stitch
 */
export const reports = {
  getAll: (status = 'All') => {
    const query = status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
    return ecotrackFetch(`/reports${query}`);
  },
  getById: (id) => ecotrackFetch(`/report/${id}`),
  create: (formData) => ecotrackFetch('/reports', {
    method: 'POST',
    body: JSON.stringify(formData)
  })
};

export default {
  ecotrackFetch,
  auth,
  getDashboardStats,
  reports
};
