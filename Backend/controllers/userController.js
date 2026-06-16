const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Customer
exports.registerCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    const token = jwt.sign(
      { userId: savedUser._id, role: savedUser.role, email: savedUser.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        cart: savedUser.cart,
        wishlist: savedUser.wishlist
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error in registration', error: error.message });
  }
};

// Login Customer
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        cart: user.cart,
        wishlist: user.wishlist
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error in login', error: error.message });
  }
};

// Sync Cart
exports.syncCart = async (req, res) => {
  try {
    const { cart } = req.body; // Expecting array of { product: productId, quantity: number }
    const userId = req.user.userId;

    const user = await User.findByIdAndUpdate(userId, { cart }, { new: true }).populate('cart.product');
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'Cart synced', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Error syncing cart', error: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password').populate('cart.product').populate('wishlist');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};
