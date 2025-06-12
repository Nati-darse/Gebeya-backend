const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'grains',
      'vegetables',
      'fruits',
      'legumes',
      'spices',
      'dairy',
      'meat',
      'other'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'quintal', 'ton', 'piece', 'liter', 'dozen']
  },
  minimumOrder: {
    type: Number,
    required: [true, 'Minimum order quantity is required'],
    min: [1, 'Minimum order must be at least 1']
  },
  availableQuantity: {
    type: Number,
    required: [true, 'Available quantity is required'],
    min: [0, 'Available quantity cannot be negative']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String
  }],
  wholesaler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    city: {
      type: String,
      required: [true, 'City is required']
    },
    region: {
      type: String,
      required: [true, 'Region is required']
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  harvestDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  quality: {
    type: String,
    enum: ['premium', 'standard', 'economy'],
    default: 'standard'
  },
  certifications: [{
    type: String,
    enum: ['organic', 'fair-trade', 'non-gmo', 'halal', 'kosher']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, location: 1 });
productSchema.index({ wholesaler: 1 });

module.exports = mongoose.model('Product', productSchema);