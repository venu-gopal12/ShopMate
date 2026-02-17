const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const { 
    registerSeller, 
    getSellerProducts, 
    getSellerOrders, 
    updateOrderItemStatus, 
    getSellerAnalytics,
    addSellerReview
} = require("../controllers/sellerController");

const router = express.Router();

// Middleware to ensure user is a seller
const seller = (req, res, next) => {
    if (req.user && (req.user.role === "seller" || req.user.role === "admin")) {
        next();
    } else {
        res.status(401).json({ message: "Not authorized as seller" });
    }
};

router.post("/register", protect, registerSeller);
router.get("/products", protect, seller, getSellerProducts);
router.get("/orders", protect, seller, getSellerOrders);
router.put("/order-item/status", protect, seller, updateOrderItemStatus);
router.get("/analytics", protect, seller, getSellerAnalytics);
router.post("/:id/review", protect, addSellerReview);

module.exports = router;
