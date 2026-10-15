const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  submitEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry
} = require('../controllers/enquiryController');
const { adminMiddleware } = require('../middleware/authMiddleware');

// Multer config for enquiry file attachments (images, pdfs, docs)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'enquiry-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Public route to submit an enquiry from Homepage or Contact page with optional file attachment
router.post('/', upload.single('attachment'), submitEnquiry);

// Admin-only management routes
router.get('/', adminMiddleware, getEnquiries);
router.get('/:id', adminMiddleware, getEnquiryById);
router.put('/:id/status', adminMiddleware, updateEnquiryStatus);
router.delete('/:id', adminMiddleware, deleteEnquiry);

module.exports = router;
