const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const Product = require('../models/Product');
const User = require('../models/User');

// @route   GET api/products
// @desc    Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ available: true })
      .populate('wholesaler', ['name', 'businessInfo.businessName']);
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/products
// @desc    Add new product (for wholesalers)
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('price', 'Price must be a positive number').isFloat({ min: 0 }),
      check('quantity', 'Quantity must be a positive number').isInt({ min: 0 }),
      check('category', 'Valid category is required').not().isEmpty(),
      check('unit', 'Valid unit is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id);
      
      // Check if user is a wholesaler
      if (user.role !== 'wholesaler') {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const {
        name,
        description,
        price,
        category,
        quantity,
        unit,
        minimumOrder,
        images
      } = req.body;

      const newProduct = new Product({
        name,
        description,
        price,
        category,
        quantity,
        unit,
        minimumOrder: minimumOrder || 1,
        images: images || [],
        wholesaler: req.user.id
      });

      const product = await newProduct.save();
      res.json(product);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// Add other product routes (update, delete, etc.)

module.exports = router;