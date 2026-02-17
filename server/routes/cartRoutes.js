
const express = require("express");

const {protect} = require("../middlewares/authMiddleware");
const {addToCart, getCart, removeFromCart} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", protect, addToCart);
router.post("/remove", protect, removeFromCart);
router.get("/", protect, getCart);

module.exports = router;