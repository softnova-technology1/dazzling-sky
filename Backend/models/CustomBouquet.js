const mongoose = require('mongoose');

const customBouquetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  whatsapp: {
    type: String,
    required: true,
    trim: true,
  },
  details: {
    type: String,
    required: true,
    trim: true,
  },
  referenceImage: {
    filename: { type: String, default: '' },
    originalName: { type: String, default: '' },
    url: { type: String, default: '' },
    mimetype: { type: String, default: '' },
    size: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['pending', 'in_review', 'contacted', 'completed', 'cancelled'],
    default: 'pending',
  },
  adminNotes: {
    type: String,
    default: '',
  }
}, { timestamps: true });

customBouquetSchema.index({ createdAt: -1 });
customBouquetSchema.index({ status: 1 });
customBouquetSchema.index({ whatsapp: 1 });

module.exports = mongoose.model('CustomBouquet', customBouquetSchema);
