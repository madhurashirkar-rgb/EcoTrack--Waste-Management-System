const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

// Helper to calculate 4-stage status progression
function getStatusProgression(report) {
  const stages = ['Reported', 'Assigned', 'In Progress', 'Collected'];
  
  // Normalize status naming: "Pending" corresponds to "Reported", "Resolved" corresponds to "Collected"
  let currentStageIndex = 0;
  const currentStatusLower = (report.status || 'pending').toLowerCase();
  
  if (currentStatusLower === 'pending' || currentStatusLower === 'reported') {
    currentStageIndex = 0;
  } else if (currentStatusLower === 'assigned') {
    currentStageIndex = 1;
  } else if (currentStatusLower === 'in progress' || currentStatusLower === 'inprogress') {
    currentStageIndex = 2;
  } else if (currentStatusLower === 'collected' || currentStatusLower === 'resolved') {
    currentStageIndex = 3;
  }

  return stages.map((stageName, index) => {
    const isCompleted = index <= currentStageIndex;
    const isCurrent = index === currentStageIndex;
    
    // Find matching history entry
    const historyItem = report.history ? report.history.find(
      (h) => (h.status || '').toLowerCase() === stageName.toLowerCase() ||
             (stageName === 'Reported' && (h.status || '').toLowerCase() === 'pending') ||
             (stageName === 'Collected' && (h.status || '').toLowerCase() === 'resolved')
    ) : null;

    return {
      step: index + 1,
      name: stageName,
      completed: isCompleted,
      current: isCurrent,
      timestamp: historyItem ? historyItem.timestamp : (isCompleted ? report.date : null),
      note: historyItem ? historyItem.note : (isCompleted ? `Status reached: ${stageName}` : 'Pending subsequent review')
    };
  });
}

// GET /api/reports (or /api/report)
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, all } = req.query;
    let list = db.reports.find();

    // If citizen and not requesting all (or not admin), only show their reports
    if (req.user.role !== 'admin' && all !== 'true') {
      list = list.filter((r) => r.userId === req.user.id);
    }

    // Filter by status if provided
    if (status && status !== 'All') {
      list = list.filter((r) => r.status.toLowerCase() === status.toLowerCase());
    }

    // Enhance each report with summary info
    const enrichedList = list.map((report) => ({
      ...report,
      progressionSummary: getStatusProgression(report)
    }));

    return res.json({
      success: true,
      count: enrichedList.length,
      data: enrichedList
    });
  } catch (error) {
    console.error('Fetch reports error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve reports.'
    });
  }
});

// GET /api/reports/:id or /api/report/:id
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const report = db.reports.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Report with ID '${id}' was not found.`
      });
    }

    const progression = getStatusProgression(report);

    return res.json({
      success: true,
      data: {
        ...report,
        statusProgression: progression
      }
    });
  } catch (error) {
    console.error('Fetch single report error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve report details.'
    });
  }
});

// POST /api/reports or /api/report
router.post('/', authenticateToken, (req, res) => {
  try {
    const { wasteType, location, description, image } = req.body;

    // Validation
    if (!wasteType || !location || !description) {
      return res.status(400).json({
        success: false,
        message: 'wasteType, location, and description are required fields.'
      });
    }

    const now = new Date().toISOString();
    const newReport = {
      id: `rep-${Date.now()}`,
      userId: req.user.id,
      userName: req.user.name,
      wasteType: wasteType.trim(),
      location: location.trim(),
      description: description.trim(),
      image: image || 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
      status: 'Pending',
      date: now,
      assignedTo: null,
      resolutionNotes: null,
      history: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Waste report logged by citizen and queued for dispatch.'
        }
      ]
    };

    // Save report
    db.reports.create(newReport);

    // Award +50 EcoPoints to user
    const currentPoints = req.user.ecoPoints || 0;
    const updatedUser = db.users.update(req.user.id, {
      ecoPoints: currentPoints + 50
    });

    return res.status(201).json({
      success: true,
      message: 'Waste report submitted successfully! You earned +50 EcoPoints.',
      data: {
        report: {
          ...newReport,
          statusProgression: getStatusProgression(newReport)
        },
        ecoPointsEarned: 50,
        totalEcoPoints: updatedUser ? updatedUser.ecoPoints : currentPoints + 50
      }
    });
  } catch (error) {
    console.error('Submit report error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit waste report.'
    });
  }
});

// PUT /api/reports/:id/status or PATCH /api/reports/:id/status
const updateStatusHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedTo, resolutionNotes } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required (Pending, Assigned, In Progress, Collected).'
      });
    }

    const report = db.reports.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: `Report with ID '${id}' was not found.`
      });
    }

    // Capitalize status properly
    const validStatuses = ['Pending', 'Assigned', 'In Progress', 'Collected', 'Resolved'];
    const matchedStatus = validStatuses.find(
      (s) => s.toLowerCase() === status.toLowerCase()
    ) || status;

    const updatedHistory = [...(report.history || [])];
    const now = new Date().toISOString();

    updatedHistory.push({
      status: matchedStatus,
      timestamp: now,
      note: resolutionNotes || `Status updated to ${matchedStatus}`
    });

    const updates = {
      status: matchedStatus === 'Resolved' ? 'Collected' : matchedStatus,
      history: updatedHistory
    };

    if (assignedTo !== undefined) updates.assignedTo = assignedTo;
    if (resolutionNotes !== undefined) updates.resolutionNotes = resolutionNotes;

    const updated = db.reports.update(id, updates);

    return res.json({
      success: true,
      message: `Report status updated to '${updates.status}'.`,
      data: {
        ...updated,
        statusProgression: getStatusProgression(updated)
      }
    });
  } catch (error) {
    console.error('Update report status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update report status.'
    });
  }
};

router.put('/:id/status', authenticateToken, updateStatusHandler);
router.patch('/:id/status', authenticateToken, updateStatusHandler);

module.exports = router;
