const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const sendEmail = require('../utils/sendEmail');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, shippingPrice } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items in order' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.address) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // Server-side price calculation and stock validation
    let verifiedSubtotal = 0;
    const verifiedItems = [];

    for (const item of orderItems) {
      let itemPrice = Number(item.price) || 0;

      // If item is a real database product, verify price & deduct inventory
      if (item.product && mongoose.Types.ObjectId.isValid(item.product)) {
        const dbProduct = await Product.findById(item.product);
        if (dbProduct) {
          itemPrice = dbProduct.price; // Enforce DB price to prevent client tampering
          
          if (dbProduct.stock !== undefined && dbProduct.stock < item.quantity) {
            return res.status(400).json({ 
              message: `Insufficient stock for "${dbProduct.name}". Only ${dbProduct.stock} remaining.` 
            });
          }

          // Atomically decrement stock
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity }
          });
        }
      }

      verifiedSubtotal += itemPrice * item.quantity;
      verifiedItems.push({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: itemPrice,
        product: item.product ? item.product.toString() : 'custom'
      });
    }

    const calculatedShipping = Number(shippingPrice) || 0;
    const calculatedTax = Number((verifiedSubtotal * 0.08).toFixed(2));
    const calculatedTotal = Number((verifiedSubtotal + calculatedShipping + calculatedTax).toFixed(2));

    const order = new Order({
      user: req.user.userId || req.user.id,
      orderItems: verifiedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Credit Card',
      taxPrice: calculatedTax,
      shippingPrice: calculatedShipping,
      totalPrice: calculatedTotal
    });

    const createdOrder = await order.save();
    
    // Attempt to send email asynchronously (so it doesn't block response)
    sendEmail({
      email: req.user.email || shippingAddress.email || 'guest@example.com',
      customerName: shippingAddress.fullName,
      orderId: createdOrder._id.toString(),
      orderItems: verifiedItems,
      shippingPrice: calculatedShipping,
      taxPrice: calculatedTax,
      totalPrice: calculatedTotal
    });

    res.status(201).json(createdOrder);
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

// Admin: Update order details (status, recipient, address, payment)
exports.updateOrder = async (req, res) => {
  try {
    const { status, shippingAddress, paymentMethod, isPaid } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status !== undefined) order.status = status;
    if (paymentMethod !== undefined) order.paymentMethod = paymentMethod;
    if (isPaid !== undefined) order.isPaid = isPaid;
    if (shippingAddress) {
      order.shippingAddress = {
        fullName: shippingAddress.fullName || order.shippingAddress.fullName,
        address: shippingAddress.address || order.shippingAddress.address,
        city: shippingAddress.city || order.shippingAddress.city,
        postalCode: shippingAddress.postalCode || order.shippingAddress.postalCode,
        phone: shippingAddress.phone || order.shippingAddress.phone,
        email: shippingAddress.email || order.shippingAddress.email
      };
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
};

// Admin: Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
};
