const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'Dazzling Sky Luxury Floral Atelier',
  },
  contactEmail: {
    type: String,
    default: 'concierge@dazzlingsky.com',
  },
  contactPhone: {
    type: String,
    default: '+1 (800) 555-LUXE',
  },
  storeAddress: {
    type: String,
    default: '123 Luxury Atelier Blvd, Suite 400, Beverly Hills, CA 90210',
  },
  deliveryFee: {
    type: Number,
    default: 15.00,
  },
  freeDeliveryThreshold: {
    type: Number,
    default: 150.00,
  },
  taxRate: {
    type: Number,
    default: 8.5,
  },
  currency: {
    type: String,
    default: 'USD ($)',
  }
}, { timestamps: true });

module.exports = mongoose.model('Setting', settingSchema);
