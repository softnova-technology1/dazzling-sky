const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    trim: true,
    uppercase: true,
  },
  slug: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  bannerImage: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

categorySchema.index({ code: 1 });

module.exports = mongoose.model('Category', categorySchema);
