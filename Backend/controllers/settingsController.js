const Setting = require('../models/Setting');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

// Get Settings (public/admin)
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching settings', error: error.message });
  }
};

// Update Store Settings (admin only)
exports.updateSettings = async (req, res) => {
  try {
    const { 
      storeName, contactEmail, contactPhone, storeAddress, 
      deliveryFee, freeDeliveryThreshold, taxRate, currency 
    } = req.body;

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    if (storeName !== undefined) settings.storeName = storeName;
    if (contactEmail !== undefined) settings.contactEmail = contactEmail;
    if (contactPhone !== undefined) settings.contactPhone = contactPhone;
    if (storeAddress !== undefined) settings.storeAddress = storeAddress;
    if (deliveryFee !== undefined) settings.deliveryFee = Number(deliveryFee);
    if (freeDeliveryThreshold !== undefined) settings.freeDeliveryThreshold = Number(freeDeliveryThreshold);
    if (taxRate !== undefined) settings.taxRate = Number(taxRate);
    if (currency !== undefined) settings.currency = currency;

    const saved = await settings.save();
    res.status(200).json({ message: 'Settings updated successfully', settings: saved });
  } catch (error) {
    res.status(500).json({ message: 'Error updating settings', error: error.message });
  }
};

// Change Admin Password (admin only)
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters long' });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin account not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.status(200).json({ message: 'Password updated successfully! Please use your new password next time.' });
  } catch (error) {
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};
