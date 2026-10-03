const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/collection-points
router.get('/', (req, res) => {
  try {
    const { type, search } = req.query;
    let list = db.collectionPoints.find();

    if (type && type !== 'All') {
      list = list.filter((cp) =>
        cp.types.some((t) => t.toLowerCase() === type.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (cp) =>
          cp.name.toLowerCase().includes(q) ||
          cp.address.toLowerCase().includes(q) ||
          cp.types.some((t) => t.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (error) {
    console.error('Collection points error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve collection points.'
    });
  }
});

// GET /api/collection-points/:id
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const point = db.collectionPoints.findById(id);

    if (!point) {
      return res.status(404).json({
        success: false,
        message: 'Collection center not found.'
      });
    }

    return res.json({
      success: true,
      data: point
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve collection center.'
    });
  }
});

module.exports = router;
