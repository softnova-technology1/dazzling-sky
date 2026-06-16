const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        user: req.user.userId,
        orderItems,
        shippingAddress,
        paymentMethod,
        taxPrice,
        shippingPrice,
        totalPrice
      });

      const createdOrder = await order.save();
      
      // Attempt to send email asynchronously (so it doesn't block response)
      sendEmail({
        email: req.user.email || shippingAddress.email || 'guest@example.com', // Logged-in user gets priority
        customerName: shippingAddress.fullName,
        orderId: createdOrder._id.toString(),
        orderItems: orderItems,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice
      });

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all orders', error: error.message });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};
