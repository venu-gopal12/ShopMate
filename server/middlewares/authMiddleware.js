
const jwt = require('jsonwebtoken');

const User = require('../models/User');

exports.protect = async(req,res,next) =>{
    let token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message: "Not authorized, no token"});
    }

    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        
        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }

        next();
    } catch (error) {
        res.status(401).json({message: "Invalid token "});
    }
}

exports.admin = (req,res,next) =>{
    if(req.user.role !== "admin")
        return res.status(403).json({message: "Not authorized as admin"});
    
    next();
}

exports.seller = (req,res,next) =>{
    if(req.user && (req.user.role === "seller" || req.user.role === "admin")){
        // Also check if seller is approved?
        // Ideally yes, but maybe we let them create but not publish? 
        // For now, let's enforce approval if role is seller.
        if (req.user.role === "seller" && !req.user.isSellerApproved) {
            return res.status(403).json({ message: "Seller account not yet approved." });
        }
        next();
    } else {
        res.status(403).json({message: "Not authorized as seller"});
    }
}



