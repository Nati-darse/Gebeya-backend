const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/order');
const { protect, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All routes require admin authentication
router.use(protect, isAdmin);

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalWholesalers = await User.countDocuments({ role: 'wholesaler' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
    // Calculate total revenue (from completed orders)
    const revenueResult = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name email')
      .populate('wholesaler', 'name businessName')
      .sort({ createdAt: -1 })
      .limit(5);

    // Top products by order count
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', orderCount: { $sum: 1 } } },
      { $sort: { orderCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          category: '$product.category',
          orderCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalWholesalers,
          totalCustomers,
          totalProducts,
          activeProducts,
          totalOrders,
          pendingOrders,
          totalRevenue
        },
        recentOrders,
        topProducts
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching admin statistics',
      error: error.message
    });
  }
});

// @desc    Get all orders (Admin view)
// @route   GET /api/admin/orders
// @access  Private/Admin
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    
    const filter = {};
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let query = Order.find(filter)
      .populate('customer', 'name email phone')
      .populate('wholesaler', 'name businessName phone')
      .populate('items.product', 'name unit')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    if (search) {
      // Add search functionality if needed
      filter.$or = [
        { orderNumber: new RegExp(search, 'i') }
      ];
    }

    const orders = await query;
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

// @desc    Approve/Reject wholesaler
// @route   PUT /api/admin/wholesalers/:id/approve
// @access  Private/Admin
router.put('/wholesalers/:id/approve', async (req, res) => {
  try {
    const { isVerified } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'wholesaler') {
      return res.status(400).json({
        success: false,
        message: 'User is not a wholesaler'
      });
    }

    user.isVerified = isVerified;
    await user.save();

    res.json({
      success: true,
      message: `Wholesaler ${isVerified ? 'approved' : 'rejected'} successfully`,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating wholesaler status',
      error: error.message
    });
  }
});

module.exports = router;