
const User = require("../models/User");
const Product = require("../models/Product");
// ADD TO CART

exports.addToCart = async(req,res)=>{
    try {
        const {productId, quantity} = req.body;
        console.log("🛒 Add to Cart Request:", { userId: req.user._id, productId, quantity });

        const user = await User.findById(req.user._id);
        if(!user){
            console.error("❌ User not found:", req.user._id);
            return res.status(404).json({message:"User not found"});
        }
        
        // Ensure user.cart exists
        if (!user.cart) user.cart = [];

        // Find index correctly by comparing IDs
        const itemIndex = user.cart.findIndex(item => item.product && item.product.toString() === productId);
        console.log("🔍 Item Index:", itemIndex);
        
        if(itemIndex > -1){
            user.cart[itemIndex].quantity += (Number(quantity) || 1);
            console.log("📈 Updated existing item quantity:", user.cart[itemIndex].quantity);
        } else {
            user.cart.push({product: productId, quantity: (Number(quantity) || 1)});
            console.log("➕ Added new item to cart");
        }
        
        await user.save();
        console.log("💾 User cart saved successfully");
        
        // Re-fetch with population for the response
        const updatedUser = await User.findById(req.user._id).populate('cart.product');
        console.log("📋 Returning updated cart with", updatedUser.cart.length, "items");
        res.json({items: updatedUser.cart});
    } catch (error) {
        console.error("❌ Add to Cart Error:", error);
        res.status(500).json({message:error.message});
    }
}

exports.removeFromCart = async(req,res)=>{
    try {
        const {productId} = req.body;
        const user = await User.findById(req.user._id);
        user.cart = user.cart.filter(item => item.product.toString() !== productId);
        await user.save();
        
        const updatedUser = await User.findById(req.user._id).populate('cart.product');
        res.json({items: updatedUser.cart});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

// GET CART
exports.getCart = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id).populate('cart.product');
        res.json({items: user.cart || []});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}