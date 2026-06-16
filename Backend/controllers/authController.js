const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Admin Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Create initial admin (Use only once, then remove or secure)
exports.createInitialAdmin = async (req, res) => {
  try {
    const adminExists = await Admin.findOne({ email: 'admin@dazzlingsky.com' });
    if (adminExists) {
      return res.status(400).json({ message: 'Initial admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = new Admin({
      email: 'admin@dazzlingsky.com',
      password: hashedPassword
    });

    await admin.save();
    res.status(201).json({ message: 'Initial admin created successfully (admin@dazzlingsky.com / admin123)' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
};
