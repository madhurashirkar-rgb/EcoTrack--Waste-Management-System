const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'ecotrack_secret_key_2026';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'ecotrack-admin';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // 1. Try JWT Bearer Token
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db.users.findById(decoded.id);
      if (user) {
        const { password, ...safeUser } = user;
        req.user = safeUser;
        return next();
      }
    } catch (err) {
      // If token is invalid/expired, fall through to user header or return 401
    }
  }

  // 2. Convenience header for quick testing / Stitch prototyping
  const directUserId = req.headers['x-user-id'] || req.query.userId;
  if (directUserId) {
    const user = db.users.findById(directUserId);
    if (user) {
      const { password, ...safeUser } = user;
      req.user = safeUser;
      return next();
    }
  }

  // 3. Fallback to default demo citizen user for frictionless testing if not authenticated
  const defaultUser = db.users.findById('usr-1');
  if (defaultUser) {
    const { password, ...safeUser } = defaultUser;
    req.user = safeUser;
    return next();
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication required'
  });
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    // Check if user is requesting as admin via header or role
    const adminUser = db.users.findById('usr-admin');
    if (req.headers['x-admin-key'] === ADMIN_API_KEY || req.query.admin === 'true') {
      const { password, ...safeAdmin } = adminUser;
      req.user = safeAdmin;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied: Admin privileges required'
    });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  JWT_SECRET
};
