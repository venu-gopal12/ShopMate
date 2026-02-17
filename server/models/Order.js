const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
      },
        seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      price: {
        type: Number,
        required: true
      },
      status: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancellation_requested", "cancelled", "return_requested", "returned"],
        default: "processing"
      }
    }
  ],

  totalAmount: {
    type: Number,
    required: true,
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending",
  },

  orderStatus: {
    type: String,
    enum: ["processing", "shipped", "completed", "Cancelled"],
    default: "processing",
  },

  address: {
    type: String,
    required: true,
  }
}, 
{ timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
