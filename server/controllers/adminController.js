const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

// GET DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();
        const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Recent Orders (last 5)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalSales,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
