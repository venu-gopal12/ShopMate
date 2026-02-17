const Order = require("../models/Order");
const User = require("../models/User");

// PLACE ORDER
// PLACE ORDER
exports.placeOrder = async (req, res) => {
  const { address } = req.body;

  const user = await User.findById(req.user._id).populate("cart.product");
  if (user.cart.length === 0) return res.status(400).json({ message: "Cart is empty" });

  // Validate Stock & Snapshot Items
  const items = [];
  let totalAmount = 0;

  for (const item of user.cart) {
      const product = item.product;
      
      if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      // Snapshot price and detail
      items.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price, // Save price at time of purchase
          seller: product.seller,
          status: 'processing'
      });

      totalAmount += product.price * item.quantity;
  }

  // Deduct Stock
  // We do this in a loop or bulkWrite. For safety, let's do atomic updates.
  // If one fails, we should ideally rollback transaction, but for now simple atomic decrement.
  const updatePromises = items.map(item => 
      require("../models/Product").updateOne(
          { _id: item.product },
          { $inc: { stock: -item.quantity } }
      )
  );

  try {
      await Promise.all(updatePromises);
      
      const order = await Order.create({
          user: user._id,
          items,
          totalAmount,
          address,
      });

      user.cart = [];
      await user.save();

      res.json({ message: "Order placed", order });
  } catch (err) {
      // In a real app, we would need to rollback stock changes here if order creation fails
      console.error("Order creation failed", err);
      res.status(500).json({ message: "Failed to place order" });
  }
};

// USER ORDERS
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product")
    .populate("items.seller", "shopName name");
  res.json(orders);
};

// ADMIN — ALL ORDERS
exports.getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user")
    .populate("items.product")
    .populate("items.seller", "shopName name email")
    .sort({ createdAt: -1 });
  console.log(`Admin fetching all orders: Found ${orders.length} orders`);
  res.json(orders);
};

// ADMIN UPDATE ORDER STATUS
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { orderStatus: status },
    { new: true }
  );

  res.json({ message: "Order status updated", order });
};

// CANCEL ORDER
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: "Not authorized" });
        }

        // Legacy full order cancellation (optional, or we can remove/restrict it)
        // For now, let's keep it but maybe restricted to 'processing' only
        if (order.orderStatus !== 'processing') {
             return res.status(400).json({ message: "Cannot cancel order at this stage" });
        }

        order.orderStatus = 'Cancelled';
        // Also cancel all items?
        order.items.forEach(item => {
            item.status = 'cancelled';
        });
        
        await order.save();

        res.json({ message: "Order cancelled", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REQUEST ITEM CANCELLATION
exports.requestItemCancellation = async (req, res) => {
    try {
        const { orderId, itemId } = req.params;
        const order = await Order.findOne({ _id: orderId, user: req.user._id });

        if (!order) return res.status(404).json({ message: "Order not found" });

        const item = order.items.id(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        if (item.status === 'processing') {
            item.status = 'cancellation_requested';
        } else if (item.status === 'delivered') {
            item.status = 'return_requested';
        } else {
            return res.status(400).json({ message: `Cannot cancel/return item in current status: ${item.status}` });
        }

        const savedOrder = await order.save();
        const populatedOrder = await Order.findById(savedOrder._id)
            .populate("items.product")
            .populate("items.seller", "shopName name")
            .populate("user", "name email");

        res.json({ message: item.status === 'return_requested' ? "Return requested" : "Cancellation requested", order: populatedOrder });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

