const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');
const reportsRoutes = require('./routes/reports');
const collectionPointsRoutes = require('./routes/collectionPoints');
const ecoTipsRoutes = require('./routes/ecoTips');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend-backend connection (Stitch, Vite, React)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-admin-key']
  })
);

// Enable JSON body parsing
const bodyLimit = process.env.BODY_LIMIT || '10mb';
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ extended: true, limit: bodyLimit }));

// Request logger for development transparency
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to EcoTrack – Waste Management System API',
    version: '1.0.0',
    documentation: '/api',
    stitchReady: true
  });
});

app.get('/api', (req, res) => {
  res.json({
    success: true,
    name: 'EcoTrack API Gateway',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me'
      },
      dashboard: {
        stats: 'GET /api/dashboard/stats'
      },
      reports: {
        list: 'GET /api/reports',
        create: 'POST /api/reports',
        single: 'GET /api/report/:id',
        updateStatus: 'PATCH /api/reports/:id/status'
      },
      collectionPoints: {
        list: 'GET /api/collection-points',
        single: 'GET /api/collection-points/:id'
      },
      ecoTips: {
        list: 'GET /api/eco-tips',
        today: 'GET /api/eco-tips/today'
      },
      user: {
        profile: 'GET /api/user/profile'
      },
      admin: {
        allReports: 'GET /api/admin/reports',
        updateStatus: 'PATCH /api/admin/report/:id/status'
      }
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// Register modular REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/report', reportsRoutes);
app.use('/api/collection-points', collectionPointsRoutes);
app.use('/api/eco-tips', ecoTipsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error occurred.'
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🌱 EcoTrack Backend Server running on port ${PORT}`);
  console.log(`🔗 REST API base URL: http://localhost:${PORT}/api`);
  console.log(`✨ Stitch CORS & JSON enabled for rapid frontend integration`);
  console.log(`=======================================================`);
});

module.exports = app;
