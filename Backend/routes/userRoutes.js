const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const jwt = require('jsonwebtoken');

// Simple auth middleware for customer routes
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

router.post('/register', userController.registerCustomer);
router.post('/login', userController.loginCustomer);
router.get('/profile', authMiddleware, userController.getProfile);
router.post('/cart/sync', authMiddleware, userController.syncCart);

module.exports = router;
