const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const allReports = db.reports.find();
    
    // User-specific reports
    const userReports = allReports.filter((r) => r.userId === userId);

    // Calculate metrics
    const reportsSubmitted = userReports.length;
    const wasteCollected = userReports.filter((r) => r.status.toLowerCase() === 'collected').length;
    const pendingReports = userReports.filter((r) => r.status.toLowerCase() === 'pending').length;
    const ecoPoints = req.user.ecoPoints || 0;

    // Time-based greeting
    const hour = new Date().getHours();
    let greetingPrefix = 'Good day';
    if (hour < 12) greetingPrefix = 'Good morning';
    else if (hour < 18) greetingPrefix = 'Good afternoon';
    else greetingPrefix = 'Good evening';

    const greeting = `${greetingPrefix}, ${req.user.name.split(' ')[0]}!`;

    // Global community impact stats
    const globalStats = {
      totalCommunityReports: allReports.length,
      totalCommunityResolved: allReports.filter((r) => r.status.toLowerCase() === 'collected').length
    };

    return res.json({
      success: true,
      data: {
        greeting,
        reportsSubmitted,
        wasteCollected,
        pendingReports,
        ecoPoints,
        user: req.user,
        globalStats
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard stats.'
    });
  }
});

module.exports = router;
