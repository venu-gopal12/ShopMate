const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// REGISTER AS SELLER
exports.registerSeller = async (req, res) => {
    try {
        const { shopName } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) return res.status(404).json({ message: "User not found" });
        
        user.role = "seller";
        user.shopName = shopName;
        user.isSellerApproved = false; // Requires admin approval
        
        await user.save();
        
        res.json({ message: "Seller application submitted. Please wait for admin approval.", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SELLER PRODUCTS
exports.getSellerProducts = async (req, res) => {
    try {
        const products = await Product.find({ seller: req.user._id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SELLER ORDERS
exports.getSellerOrders = async (req, res) => {
    try {
        // Find orders that contain at least one item sold by this seller
        const orders = await Order.find({ "items.seller": req.user._id })
            .populate("user", "name email")
            .populate("items.product")
            .sort({ createdAt: -1 });
            
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE ORDER ITEM STATUS
exports.updateOrderItemStatus = async (req, res) => {
    try {
        const { orderId, productId, status } = req.body;
        
        const order = await Order.findOne({ _id: orderId, "items.seller": req.user._id });
        
        if (!order) return res.status(404).json({ message: "Order not found or not authorized" });

        const item = order.items.find(i => 
            i.product.toString() === productId && 
            i.seller.toString() === req.user._id.toString()
        );

        if (!item) return res.status(404).json({ message: "Item not found in order" });

        // If trying to cancel, allow it (seller can cancel out of stock etc)
        // if (status === 'cancelled' && item.status !== 'cancellation_requested') {
        //      return res.status(400).json({ message: "Can only cancel items with a cancellation request" });
        // }
        
        // If rejecting cancellation, set back to processing
        // Logic handled by frontend sending 'processing', but good to validate context?
        // Let's just allow the status update for now as long as it's valid enum.
        
        item.status = status;

        // Auto-update parent order status if all items are completed/delivered
        const allDelivered = order.items.every(i => i.status === 'delivered' || i.status === 'completed' || i.status === 'returned');
        const allCancelled = order.items.every(i => i.status === 'cancelled');
        const anyShipped = order.items.some(i => i.status === 'shipped');

        if (allDelivered) {
            order.orderStatus = 'completed';
        } else if (allCancelled) {
            order.orderStatus = 'Cancelled';
        } else if (anyShipped && order.orderStatus === 'processing') {
            order.orderStatus = 'shipped';
        }

        const savedOrder = await order.save();

        // Re-populate for frontend
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate("items.product")
            .populate("items.seller", "shopName name")
            .populate("user", "name email");
        
        res.json({ message: "Item status updated", order: populatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SELLER ANALYTICS
// GET SELLER ANALYTICS
exports.getSellerAnalytics = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({ seller: req.user._id });

        const stats = await Order.aggregate([
            { $match: { "items.seller": req.user._id } },
            { $unwind: "$items" },
            { $match: { "items.seller": req.user._id } },
            { $group: {
                _id: null,
                totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
                totalOrders: { $addToSet: "$_id" }
            }},
            { $project: {
                totalSales: 1,
                totalOrders: { $size: "$totalOrders" }
            }}
        ]);

        const result = stats[0] || { totalSales: 0, totalOrders: 0 };

        res.json({ 
            totalSales: result.totalSales, 
            totalOrders: result.totalOrders, 
            totalProducts 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADD SELLER REVIEW
exports.addSellerReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const seller = await User.findById(req.params.id);

        if (!seller || seller.role !== 'seller') {
            return res.status(404).json({ message: "Seller not found" });
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        seller.sellerReviews.push(review);

        seller.sellerRating = seller.sellerReviews.length > 0
            ? seller.sellerReviews.reduce((acc, item) => item.rating + acc, 0) / seller.sellerReviews.length
            : 0;

        await seller.save();
        res.status(201).json({ message: "Seller review added" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
