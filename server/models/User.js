const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "seller"], default: "user" },
  shopName: { type: String },
  isSellerApproved: { type: Boolean, default: false },
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  addresses: [
    {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    }
  ],
  sellerReviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  sellerRating: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
