const CustomBouquet = require('../models/CustomBouquet');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Helper to notify admin via email if SMTP is configured
const sendAdminCustomBokehNotification = async (request) => {
  try {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || emailUser;

    if (!emailUser || !emailPass) return;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
    });

    const emailAttachments = [];
    if (request.referenceImage && request.referenceImage.filename) {
      const filePath = path.join(__dirname, '..', 'uploads', request.referenceImage.filename);
      if (fs.existsSync(filePath)) {
        emailAttachments.push({
          filename: request.referenceImage.originalName || request.referenceImage.filename,
          path: filePath,
        });
      }
    }

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #0e0719; color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid rgba(192, 132, 252, 0.45);">
        <h2 style="color: #ff8ad8; margin-top: 0;">🌸 New Bespoke Bouquet Request Received!</h2>
        <p style="color: #e9d5ff;">A customer has submitted a bespoke customization request on your shop page:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; color: #ffffff;">
          <tr>
            <td style="padding: 8px 0; color: #d8b4fe; width: 140px;">Client Name:</td>
            <td style="padding: 8px 0; font-weight: bold;">${request.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #d8b4fe;">WhatsApp No:</td>
            <td style="padding: 8px 0;"><a href="https://wa.me/${request.whatsapp.replace(/[^0-9]/g, '')}" style="color: #25D366; font-weight: bold; text-decoration: underline;">${request.whatsapp}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #d8b4fe;">Received At:</td>
            <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; background: rgba(18, 9, 31, 0.6); border-left: 3px solid #ff8ad8; padding: 15px; border-radius: 6px;">
          <strong style="color: #ff8ad8;">Customization Details:</strong>
          <p style="margin: 8px 0 0 0; white-space: pre-wrap; line-height: 1.6; color: #f3e8ff;">${request.details}</p>
        </div>
        ${request.referenceImage?.url ? `<p style="margin-top: 15px; color: #d8b4fe;">📎 <em>Reference image attached to this email.</em></p>` : ''}
        <p style="margin-top: 25px; font-size: 12px; color: #c084fc;">Manage this request in your <a href="http://localhost:3000/admin/customizations" style="color: #ff8ad8;">Admin Custom Bouquets Dashboard</a>.</p>
      </div>
    `;

    await transporter.sendMail({
      from: `"Dazzling Sky Atelier" <${emailUser}>`,
      to: adminRecipient,
      subject: `[Bespoke Bouquet Request] From ${request.name} (${request.whatsapp})`,
      html,
      attachments: emailAttachments
    });
    console.log('✅ Custom bouquet email alert sent to admin');
  } catch (err) {
    console.error('Failed sending custom bouquet email notification:', err.message);
  }
};

// @desc    Submit new custom bokeh request (Public)
// @route   POST /api/customizations
// @access  Public
const submitCustomBouquet = async (req, res) => {
  try {
    const { name, whatsapp, details } = req.body;

    if (!name || !name.trim() || !whatsapp || !whatsapp.trim() || !details || !details.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, WhatsApp number, and customization details.'
      });
    }

    let referenceImageData = {
      filename: '',
      originalName: '',
      url: '',
      mimetype: '',
      size: 0
    };

    if (req.file) {
      referenceImageData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }

    const newRequest = new CustomBouquet({
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      details: details.trim(),
      referenceImage: referenceImageData,
      status: 'pending'
    });

    const savedRequest = await newRequest.save();

    // Trigger async email alert
    sendAdminCustomBokehNotification(savedRequest).catch(e => console.error(e));

    return res.status(201).json({
      success: true,
      message: 'Your custom bouquet request has been received! Our florists will connect with you on WhatsApp shortly.',
      data: savedRequest
    });
  } catch (error) {
    console.error('Error submitting custom bouquet:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting your customization request.'
    });
  }
};

// @desc    Get all custom bouquet requests (Admin only)
// @route   GET /api/customizations
// @access  Admin
const getAllCustomBouquets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { whatsapp: searchRegex },
        { details: searchRegex },
        { adminNotes: searchRegex }
      ];
    }

    const total = await CustomBouquet.countDocuments(query);
    const requests = await CustomBouquet.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Compute aggregated stats
    const [totalCount, pendingCount, inReviewCount, contactedCount, completedCount] = await Promise.all([
      CustomBouquet.countDocuments({}),
      CustomBouquet.countDocuments({ status: 'pending' }),
      CustomBouquet.countDocuments({ status: 'in_review' }),
      CustomBouquet.countDocuments({ status: 'contacted' }),
      CustomBouquet.countDocuments({ status: 'completed' })
    ]);

    return res.json({
      success: true,
      data: requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      },
      stats: {
        total: totalCount,
        pending: pendingCount,
        inReview: inReviewCount,
        contacted: contactedCount,
        completed: completedCount
      }
    });
  } catch (error) {
    console.error('Error fetching custom bouquet requests:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve custom bouquet requests'
    });
  }
};

// @desc    Get single custom bouquet by ID (Admin only)
// @route   GET /api/customizations/:id
// @access  Admin
const getCustomBouquetById = async (req, res) => {
  try {
    const request = await CustomBouquet.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Customization request not found' });
    }
    return res.json({ success: true, data: request });
  } catch (error) {
    console.error('Error fetching custom bouquet by ID:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update status or notes (Admin only)
// @route   PUT /api/customizations/:id/status
// @access  Admin
const updateCustomBouquetStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const request = await CustomBouquet.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Customization request not found' });
    }

    if (status) {
      const validStatuses = ['pending', 'in_review', 'contacted', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }
      request.status = status;
    }

    if (adminNotes !== undefined) {
      request.adminNotes = adminNotes;
    }

    const updated = await request.save();
    return res.json({
      success: true,
      message: 'Customization request updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating custom bouquet request:', error);
    return res.status(500).json({ success: false, message: 'Server error updating request' });
  }
};

// @desc    Delete custom bouquet request (Admin only)
// @route   DELETE /api/customizations/:id
// @access  Admin
const deleteCustomBouquet = async (req, res) => {
  try {
    const request = await CustomBouquet.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Customization request not found' });
    }

    await CustomBouquet.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Customization request deleted successfully' });
  } catch (error) {
    console.error('Error deleting custom bouquet request:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting request' });
  }
};

module.exports = {
  submitCustomBouquet,
  getAllCustomBouquets,
  getCustomBouquetById,
  updateCustomBouquetStatus,
  deleteCustomBouquet
};
