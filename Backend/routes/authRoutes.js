const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route: /api/auth/login
router.post('/login', authController.login);

// Route: /api/auth/setup
// This is a temporary route to create the first admin user
router.post('/setup', authController.createInitialAdmin);

module.exports = router;
