const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    
    let revenueData = [];
    let ordersData = [];

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthStr = monthNames[d.getMonth()];
      revenueData.push({ month: monthStr, revenue: 0 });
      ordersData.push({ month: monthStr, orders: 0 });
    }

    const categoryDataMap = {};

    // Calculate total revenue from all orders (excluding cancelled)
    const orders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    orders.forEach(order => {
      const d = new Date(order.createdAt || Date.now());
      const diffMonths = (currentDate.getFullYear() - d.getFullYear()) * 12 + (currentDate.getMonth() - d.getMonth());
      if (diffMonths >= 0 && diffMonths <= 5) {
        const index = 5 - diffMonths;
        revenueData[index].revenue += order.totalPrice;
        ordersData[index].orders += 1;
      }

      // Group categories
      if (order.orderItems) {
        order.orderItems.forEach(item => {
          let cat = 'Bouquets';
          const name = (item.name || '').toLowerCase();
          if (name.includes('vase')) cat = 'Vases';
          else if (name.includes('gift')) cat = 'Gifts';
          else if (name.includes('wedding')) cat = 'Wedding';
          categoryDataMap[cat] = (categoryDataMap[cat] || 0) + (item.quantity || 1);
        });
      }
    });

    let categoryData = Object.keys(categoryDataMap).map(k => ({ name: k, value: categoryDataMap[k] }));
    if (categoryData.length === 0) categoryData = [{ name: 'Bouquets', value: 100 }];

    res.status(200).json({
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProducts,
      revenueData,
      ordersData,
      categoryData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// Get All Customers
exports.getAllCustomers = async (req, res) => {
  try {
    // Exclude password and fetch only users with role 'customer'
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error: error.message });
  }
};
