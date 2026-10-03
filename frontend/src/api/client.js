/**
 * EcoTrack API Client
 * Compatible with standard React, Vite, and Stitch frontend environments.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper for authenticated HTTP requests
async function request(endpoint, options = {}) {
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
    const errorMsg = data.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.data = data;
    throw err;
  }

  return data;
}

export const api = {
  // Authentication
  auth: {
    login: async (email, password) => {
      const res = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.data?.token) {
        localStorage.setItem('ecotrack_token', res.data.token);
        localStorage.setItem('ecotrack_user', JSON.stringify(res.data.user));
      }
      return res.data;
    },
    signup: async (userData) => {
      const res = await request('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
      if (res.data?.token) {
        localStorage.setItem('ecotrack_token', res.data.token);
        localStorage.setItem('ecotrack_user', JSON.stringify(res.data.user));
      }
      return res.data;
    },
    logout: () => {
      localStorage.removeItem('ecotrack_token');
      localStorage.removeItem('ecotrack_user');
    },
    getMe: () => request('/auth/me')
  },

  // Dashboard
  dashboard: {
    getStats: () => request('/dashboard/stats')
  },

  // Reports
  reports: {
    getAll: (status) => {
      const query = status && status !== 'All' ? `?status=${encodeURIComponent(status)}` : '';
      return request(`/reports${query}`);
    },
    getById: (id) => request(`/report/${id}`),
    create: (reportData) =>
      request('/reports', {
        method: 'POST',
        body: JSON.stringify(reportData)
      }),
    updateStatus: (id, statusData) =>
      request(`/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData)
      })
  },

  // Collection Points
  collectionPoints: {
    getAll: (type, search) => {
      const params = new URLSearchParams();
      if (type && type !== 'All') params.append('type', type);
      if (search) params.append('search', search);
      const qs = params.toString() ? `?${params.toString()}` : '';
      return request(`/collection-points${qs}`);
    },
    getById: (id) => request(`/collection-points/${id}`)
  },

  // Eco Tips
  ecoTips: {
    getAll: () => request('/eco-tips'),
    getDaily: () => request('/eco-tips/today')
  },

  // User Profile
  user: {
    getProfile: () => request('/user/profile')
  },

  // Admin
  admin: {
    getReports: (status, wasteType) => {
      const params = new URLSearchParams();
      if (status && status !== 'All') params.append('status', status);
      if (wasteType && wasteType !== 'All') params.append('wasteType', wasteType);
      const qs = params.toString() ? `?${params.toString()}` : '';
      return request(`/admin/reports${qs}`);
    },
    updateReportStatus: (id, statusData) =>
      request(`/admin/report/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(statusData)
      })
  }
};

export default api;
