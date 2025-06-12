const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
} = require('../controllers/productController');
const { protect, isWholesaler } = require('../middlewares/auth');
const { validateProduct } = require('../middlewares/validation');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect); // All routes below require authentication

// Wholesaler routes
router.get('/my/products', isWholesaler, getMyProducts);
router.post('/', isWholesaler, validateProduct, createProduct);
router.put('/:id', isWholesaler, updateProduct);
router.delete('/:id', isWholesaler, deleteProduct);

module.exports = router;