const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
    default: '',
  },
  subject: {
    type: String,
    trim: true,
    default: 'Bespoke Floral Consultation',
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  source: {
    type: String,
    enum: ['homepage', 'contact_page', 'other'],
    default: 'contact_page',
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new',
  },
  adminNotes: {
    type: String,
    default: '',
  },
  attachment: {
    filename: { type: String, default: '' },
    originalName: { type: String, default: '' },
    url: { type: String, default: '' },
    mimetype: { type: String, default: '' },
    size: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Optimize query indexes
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ status: 1 });
enquirySchema.index({ source: 1 });
enquirySchema.index({ email: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
