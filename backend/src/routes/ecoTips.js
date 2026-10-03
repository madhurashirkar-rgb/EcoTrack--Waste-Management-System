const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/eco-tips
router.get('/', (req, res) => {
  try {
    const list = db.ecoTips.find();
    return res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve eco tips.'
    });
  }
});

// GET /api/eco-tips/today (daily highlighted tip)
router.get('/today', (req, res) => {
  try {
    const list = db.ecoTips.find();
    // Deterministic tip of the day based on day of month
    const day = new Date().getDate();
    const tipIndex = day % list.length;
    const dailyTip = list[tipIndex] || list[0];

    return res.json({
      success: true,
      data: dailyTip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve daily tip.'
    });
  }
});

module.exports = router;
