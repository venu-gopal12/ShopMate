const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  image: {
    type: String, // URL or local file path
  },

  stock: {
    type: Number,
    default: 0,
  },
  
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],

  averageRating: {
    type: Number,
    default: 0
  }
}, 
{ timestamps: true });

module.exports = mongoose.model("Product", productSchema);
