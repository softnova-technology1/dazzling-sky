const Enquiry = require('../models/Enquiry');
const { sendAdminEnquiryNotification } = require('../utils/enquiryEmail');

// @desc    Submit a new enquiry (Public)
// @route   POST /api/enquiries
// @access  Public
const submitEnquiry = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, subject, message, source } = req.body;

    if (!firstName || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide First Name, Email Address, and Message.' 
      });
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address.' 
      });
    }

    const validSources = ['homepage', 'contact_page', 'other'];
    const sanitizedSource = validSources.includes(source) ? source : 'other';

    let attachmentData = {
      filename: '',
      originalName: '',
      url: '',
      mimetype: '',
      size: 0
    };

    if (req.file) {
      attachmentData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }

    const enquiry = new Enquiry({
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      subject: (subject || 'Bespoke Floral Consultation').trim(),
      message: message.trim(),
      source: sanitizedSource,
      status: 'new',
      attachment: attachmentData
    });

    const savedEnquiry = await enquiry.save();

    // Trigger async admin email notification (does not block response)
    sendAdminEnquiryNotification(savedEnquiry).catch(err => {
      console.error('Async admin email notification error:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you for contacting Dazzling Sky. Our floral atelier will reach out shortly.',
      data: savedEnquiry
    });
  } catch (error) {
    console.error('Error submitting enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting enquiry. Please try again later.'
    });
  }
};

// @desc    Get all enquiries with filters & stats (Admin only)
// @route   GET /api/enquiries
// @access  Admin
const getEnquiries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const source = req.query.source;
    const search = req.query.search;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (source && source !== 'all') {
      query.source = source;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { message: searchRegex },
        { phone: searchRegex }
      ];
    }

    const total = await Enquiry.countDocuments(query);
    const enquiries = await Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get aggregated statistics for the admin dashboard header
    const [statsNew, statsReplied, statsTotal, statsHomepage, statsContact] = await Promise.all([
      Enquiry.countDocuments({ status: 'new' }),
      Enquiry.countDocuments({ status: 'replied' }),
      Enquiry.countDocuments({}),
      Enquiry.countDocuments({ source: 'homepage' }),
      Enquiry.countDocuments({ source: 'contact_page' }),
    ]);

    return res.json({
      success: true,
      data: enquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1
      },
      stats: {
        total: statsTotal,
        new: statsNew,
        replied: statsReplied,
        homepage: statsHomepage,
        contactPage: statsContact,
      }
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve enquiries'
    });
  }
};

// @desc    Get single enquiry details (Admin only)
// @route   GET /api/enquiries/:id
// @access  Admin
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    // Auto mark as 'read' if it was currently 'new'
    if (enquiry.status === 'new') {
      enquiry.status = 'read';
      await enquiry.save();
    }

    return res.json({ success: true, data: enquiry });
  } catch (error) {
    console.error('Error fetching enquiry by ID:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve enquiry details' });
  }
};

// @desc    Update enquiry status or admin notes (Admin only)
// @route   PUT /api/enquiries/:id/status
// @access  Admin
const updateEnquiryStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    if (status) {
      const validStatuses = ['new', 'read', 'replied', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
      }
      enquiry.status = status;
    }

    if (adminNotes !== undefined) {
      enquiry.adminNotes = adminNotes;
    }

    const updated = await enquiry.save();
    return res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating enquiry:', error);
    return res.status(500).json({ success: false, message: 'Failed to update enquiry' });
  }
};

// @desc    Delete enquiry (Admin only)
// @route   DELETE /api/enquiries/:id
// @access  Admin
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    await Enquiry.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete enquiry' });
  }
};

module.exports = {
  submitEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  deleteEnquiry
};
