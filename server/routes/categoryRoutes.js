const express = require("express");
const { createCategory, getCategories, deleteCategory } = require("../controllers/categoryController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, admin, createCategory); // Admin
router.get("/", getCategories); // Public
router.delete("/:id", protect, admin, deleteCategory); // Admin

module.exports = router;
