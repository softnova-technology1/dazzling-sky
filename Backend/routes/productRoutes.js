const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/productController');

// Multer config for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

const { adminMiddleware } = require('../middleware/authMiddleware');

// Define routes
router.get('/', productController.getAllProducts);
router.get('/inventory/all', adminMiddleware, productController.getInventory);
router.put('/inventory/quick-update/:id', adminMiddleware, productController.quickUpdateStock);
router.put('/inventory/bulk-update', adminMiddleware, productController.bulkUpdateStock);
router.get('/sku/generate', productController.getNextSku);
router.get('/:id', productController.getProductById);
router.put('/toggle-status/:id', adminMiddleware, productController.toggleProductStatus);
router.post('/', adminMiddleware, upload.single('image'), productController.createProduct);
router.put('/:id', adminMiddleware, upload.single('image'), productController.updateProduct);
router.delete('/:id', adminMiddleware, productController.deleteProduct);

module.exports = router;
