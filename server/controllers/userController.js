const User = require("../models/User");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: req.token // If we want to return a new token or keep old one
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// WISHLIST
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { productId } = req.body;

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        res.json({ message: "Added to wishlist" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { productId } = req.params;

        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        res.json({ message: "Removed from wishlist" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADDRESSES
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses.push(req.body);
        await user.save();
        res.json({ message: "Address added", addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.id);
        await user.save();
        res.json({ message: "Address removed", addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: GET ALL USERS
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: APPROVE SELLER
exports.approveSeller = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isSellerApproved = true;
        await user.save();

        res.json({ message: "Seller approved", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ADMIN: REJECT SELLER (Optional, basically sets approved to false or changes role back)
exports.rejectSeller = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.isSellerApproved = false;
        user.role = "user"; // Revert to user
        await user.save();

        res.json({ message: "Seller rejected", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
