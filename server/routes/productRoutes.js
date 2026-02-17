const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview
} = require("../controllers/productController");

const { protect, admin, seller } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin/Seller
router.post("/", protect, seller, createProduct);
router.put("/:id", protect, seller, updateProduct);
router.delete("/:id", protect, seller, deleteProduct);

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/:id/review", protect, addProductReview);

module.exports = router;
