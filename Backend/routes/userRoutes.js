const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', userController.registerCustomer);
router.post('/login', userController.loginCustomer);
router.get('/profile', authMiddleware, userController.getProfile);
router.post('/cart/sync', authMiddleware, userController.syncCart);

module.exports = router;
