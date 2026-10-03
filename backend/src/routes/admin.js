const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// GET /api/admin/reports - Fetch all citizen reports across system
router.get('/reports', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { status, wasteType } = req.query;
    let list = db.reports.find();

    if (status && status !== 'All') {
      list = list.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    if (wasteType && wasteType !== 'All') {
      list = list.filter((r) => r.wasteType.toLowerCase() === wasteType.toLowerCase());
    }

    const allUsers = db.users.find();
    const stats = {
      total: db.reports.find().length,
      pending: db.reports.find((r) => r.status.toLowerCase() === 'pending').length,
      assigned: db.reports.find((r) => r.status.toLowerCase() === 'assigned').length,
      inProgress: db.reports.find((r) => r.status.toLowerCase() === 'in progress').length,
      collected: db.reports.find((r) => r.status.toLowerCase() === 'collected').length,
      totalUsers: allUsers.filter((u) => u.role === 'citizen').length
    };

    return res.json({
      success: true,
      data: {
        stats,
        reports: list
      }
    });
  } catch (error) {
    console.error('Admin reports fetch error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin reports.'
    });
  }
});

// PATCH /api/admin/report/:id/status or PUT /api/admin/report/:id/status
const adminUpdateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, resolutionNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required (Pending, Assigned, In Progress, Resolved / Collected).'
      });
    }

    const report = db.reports.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Report #${id} not found.`
      });
    }

    // Map 'Resolved' to 'Collected' for system consistency while supporting both names
    const normalizedStatus = status.toLowerCase() === 'resolved' ? 'Collected' : status;
    const now = new Date().toISOString();

    const updatedHistory = [...(report.history || [])];
    updatedHistory.push({
      status: normalizedStatus,
      timestamp: now,
      note: resolutionNotes || `Officer updated status to ${normalizedStatus}`
    });

    const updates = {
      status: normalizedStatus,
      history: updatedHistory
    };

    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    if (resolutionNotes !== undefined) updates.resolutionNotes = resolutionNotes;

    const updated = db.reports.update(id, updates);

    return res.json({
      success: true,
      message: `Report #${id} updated to '${normalizedStatus}'.`,
      data: updated
    });
  } catch (error) {
    console.error('Admin update status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update report status.'
    });
  }
};

router.patch('/report/:id/status', authenticateToken, requireAdmin, adminUpdateStatus);
router.put('/report/:id/status', authenticateToken, requireAdmin, adminUpdateStatus);

module.exports = router;
