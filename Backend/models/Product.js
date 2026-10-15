const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  category: {
    type: String,
    default: 'Bouquets',
  },
  sku: {
    type: String,
    trim: true,
    uppercase: true,
  },
  collectionName: {
    type: String,
    default: 'Signature Collection',
  },
  imageUrl: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    default: 20,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String,
    default: 'purple',
  },
  occasion: {
    type: String,
    default: 'Romance',
  },
  flowerType: {
    type: String,
    default: 'Roses',
  },
  rating: {
    type: Number,
    default: 5,
  },
  tag: {
    type: String,
    default: '',
  },
  longDescription: {
    type: String,
    default: '',
  },
  careInstructions: {
    type: String,
    default: '',
  },
  dimensions: {
    type: String,
    default: 'Height: 18" | Diameter: 14"',
  },
  longevity: {
    type: String,
    default: '10-14 days with proper care',
  },
  legacyId: {
    type: Number,
  }
}, { timestamps: true });

// Optimize frequent query paths with indexes
productSchema.index({ category: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ legacyId: 1 });

module.exports = mongoose.model('Product', productSchema);

