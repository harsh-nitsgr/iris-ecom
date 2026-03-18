const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQty,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCart).post(protect, addToCart);
router
  .route('/:itemId')
  .delete(protect, removeFromCart)
  .put(protect, updateCartItemQty);

module.exports = router;
