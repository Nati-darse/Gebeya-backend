const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['vegetables', 'fruits', 'grains', 'dairy', 'meat', 'other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'lb', 'piece', 'dozen', 'liter'],
    required: true
  },
  images: [{
    type: String // URLs to images
  }],
  wholesaler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  minimumOrder: {
    type: Number,
    default: 1
  },
  available: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', ProductSchema);