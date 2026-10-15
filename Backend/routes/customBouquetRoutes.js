const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  submitCustomBouquet,
  getAllCustomBouquets,
  getCustomBouquetById,
  updateCustomBouquetStatus,
  deleteCustomBouquet
} = require('../controllers/customBouquetController');
const { adminMiddleware } = require('../middleware/authMiddleware');

// Multer storage for custom bokeh reference images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'custom-bokeh-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Public submission route
router.post('/', upload.single('referenceImage'), submitCustomBouquet);

// Admin-only routes
router.get('/', adminMiddleware, getAllCustomBouquets);
router.get('/:id', adminMiddleware, getCustomBouquetById);
router.put('/:id/status', adminMiddleware, updateCustomBouquetStatus);
router.delete('/:id', adminMiddleware, deleteCustomBouquet);

module.exports = router;
