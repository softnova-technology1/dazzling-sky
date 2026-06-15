const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const jwt = require('jsonwebtoken');

// Customer auth middleware
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

// Admin auth middleware
const adminMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Admin privileges required' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Customer routes
router.post('/', authMiddleware, orderController.createOrder);
router.get('/myorders', authMiddleware, orderController.getUserOrders);

// Admin routes
router.get('/', adminMiddleware, orderController.getAllOrders);
router.put('/:id/status', adminMiddleware, orderController.updateOrderStatus);

module.exports = router;
