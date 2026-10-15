const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminMiddleware } = require('../middleware/authMiddleware');

router.get('/stats', adminMiddleware, adminController.getDashboardStats);
router.get('/customers', adminMiddleware, adminController.getAllCustomers);
router.put('/customers/:id', adminMiddleware, adminController.updateCustomer);
router.delete('/customers/:id', adminMiddleware, adminController.deleteCustomer);

module.exports = router;
