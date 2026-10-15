const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route: /api/auth/login
router.post('/login', authController.login);

// Route: /api/auth/setup (Protected one-time bootstrap route)
router.post('/setup', (req, res, next) => {
  const setupKey = req.headers['x-setup-key'];
  const expectedKey = process.env.ADMIN_SETUP_SECRET || 'dazzling_admin_setup_secret_2026';
  if (!setupKey || setupKey !== expectedKey) {
    return res.status(403).json({ message: 'Forbidden: Invalid setup key' });
  }
  next();
}, authController.createInitialAdmin);

module.exports = router;
