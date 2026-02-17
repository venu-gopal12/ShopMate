const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.get('/profile', protect, userController.getProfile);
router.put('/profile', protect, userController.updateProfile);

router.get('/wishlist', protect, userController.getWishlist);
router.post('/wishlist', protect, userController.addToWishlist);
router.delete('/wishlist/:productId', protect, userController.removeFromWishlist);

router.post('/address', protect, userController.addAddress);
router.delete('/address/:id', protect, userController.removeAddress);

// Admin Routes
router.get("/", protect, admin, userController.getAllUsers);
router.delete("/:id", protect, admin, userController.deleteUser);
router.put("/:id/approve-seller", protect, admin, userController.approveSeller);
router.put("/:id/reject-seller", protect, admin, userController.rejectSeller);

module.exports = router;
