const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Badges calculation helper
function getUserBadges(points) {
  const allBadges = [
    { id: 'b1', name: 'Green Starter', minPoints: 50, icon: '🌱', description: 'Submitted first waste report' },
    { id: 'b2', name: 'Eco Contributor', minPoints: 150, icon: '🌿', description: 'Active community waste reporter' },
    { id: 'b3', name: 'Recycle Champion', minPoints: 300, icon: '♻️', description: 'Cleaned up over 5 designated zones' },
    { id: 'b4', name: 'Zero Waste Guardian', minPoints: 500, icon: '🛡️', description: 'Outstanding neighborhood impact' },
    { id: 'b5', name: 'Eco Legend', minPoints: 1000, icon: '👑', description: 'Top tier sustainability leader' }
  ];

  return allBadges.map((badge) => ({
    ...badge,
    unlocked: points >= badge.minPoints,
    progress: Math.min(100, Math.round((points / badge.minPoints) * 100))
  }));
}

// GET /api/user/profile
router.get('/profile', authenticateToken, (req, res) => {
  try {
    const user = db.users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    const { password, ...safeUser } = user;
    const userReports = db.reports.find((r) => r.userId === user.id);

    const activitySummary = {
      totalReports: userReports.length,
      pending: userReports.filter((r) => r.status.toLowerCase() === 'pending').length,
      assigned: userReports.filter((r) => r.status.toLowerCase() === 'assigned').length,
      inProgress: userReports.filter((r) => r.status.toLowerCase() === 'in progress').length,
      collected: userReports.filter((r) => r.status.toLowerCase() === 'collected').length,
      estimatedCarbonSavedKg: (userReports.filter((r) => r.status.toLowerCase() === 'collected').length * 4.2).toFixed(1)
    };

    const badges = getUserBadges(safeUser.ecoPoints || 0);

    return res.json({
      success: true,
      data: {
        user: safeUser,
        ecoPoints: safeUser.ecoPoints || 0,
        activitySummary,
        badges,
        recentReports: userReports.slice(0, 3)
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile.'
    });
  }
});

module.exports = router;
