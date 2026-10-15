const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Customer routes
router.post('/', authMiddleware, orderController.createOrder);
router.get('/myorders', authMiddleware, orderController.getUserOrders);

// Admin routes
router.get('/', adminMiddleware, orderController.getAllOrders);
router.put('/:id/status', adminMiddleware, orderController.updateOrderStatus);
router.put('/:id', adminMiddleware, orderController.updateOrder);
router.delete('/:id', adminMiddleware, orderController.deleteOrder);

module.exports = router;
