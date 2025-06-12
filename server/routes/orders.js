const express = require('express');
const Order = require('../models/order');
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(protect);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    // Validate products and calculate totals
    let totalAmount = 0;
    const orderItems = [];
    let wholesalerId = null;

    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product with ID ${item.product} not found`
        });
      }

      if (!product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${product.name} is not available`
        });
      }

      if (item.quantity < product.minimumOrder) {
        return res.status(400).json({
          success: false,
          message: `Minimum order for ${product.name} is ${product.minimumOrder} ${product.unit}`
        });
      }

      if (item.quantity > product.availableQuantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.availableQuantity} ${product.unit} available for ${product.name}`
        });
      }

      // Ensure all products are from the same wholesaler
      if (wholesalerId && wholesalerId !== product.wholesaler.toString()) {
        return res.status(400).json({
          success: false,
          message: 'All products in an order must be from the same wholesaler'
        });
      }
      wholesalerId = product.wholesaler.toString();

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        total: itemTotal
      });
    }

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      wholesaler: wholesalerId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash',
      notes
    });

    // Update product quantities
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { availableQuantity: -item.quantity } }
      );
    }

    // Populate order details
    await order.populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'wholesaler', select: 'name businessName phone' },
      { path: 'items.product', select: 'name unit images' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message
    });
  }
});

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
router.get('/my-orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { customer: req.user.id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('wholesaler', 'name businessName phone')
      .populate('items.product', 'name unit images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
});

// @desc    Get wholesaler's orders
// @route   GET /api/orders/wholesaler-orders
// @access  Private (Wholesaler only)
router.get('/wholesaler-orders', authorize('wholesaler'), async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { wholesaler: req.user.id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name unit images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalOrders: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Wholesaler - own orders only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.wholesaler.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate([
      { path: 'customer', select: 'name email phone' },
      { path: 'wholesaler', select: 'name businessName phone' },
      { path: 'items.product', select: 'name unit images' }
    ]);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: error.message
    });
  }
});

module.exports = router;