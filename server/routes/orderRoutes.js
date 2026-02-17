const express = require("express");
const { protect, admin } = require("../middlewares/authMiddleware");
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  requestItemCancellation
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", protect, placeOrder);
router.put("/:id/cancel", protect, cancelOrder);
router.put("/:orderId/items/:itemId/cancel-request", protect, requestItemCancellation);
router.get("/my", protect, getUserOrders);

router.get("/", protect, admin, getAllOrders);
router.put("/:id", protect, admin, updateOrderStatus);

module.exports = router;
