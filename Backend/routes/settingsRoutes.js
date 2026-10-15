const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', settingsController.getSettings);
router.put('/', adminMiddleware, settingsController.updateSettings);
router.put('/change-password', adminMiddleware, settingsController.changePassword);

module.exports = router;
