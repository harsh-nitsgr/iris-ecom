const express = require('express');
const router = express.Router();
const { recordInterest, getProductInterest, getAllInterests } = require('../controllers/interestController');
const { protect, admin } = require('../middleware/authMiddleware');

// POST /api/interests/:productId  — public (guest or logged-in)
// Uses a soft-protect: tries to read the token but doesn't reject if missing
router.post('/:productId', softProtect, recordInterest);

// GET /api/interests              — admin leaderboard
router.get('/', protect, admin, getAllInterests);

// GET /api/interests/:productId   — admin per-product detail
router.get('/:productId', protect, admin, getProductInterest);

/**
 * softProtect: attach user to req if a valid Bearer token is present,
 * but never block the request if there's no token.
 */
async function softProtect(req, res, next) {
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    try {
      const token = header.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch {
      // token invalid / expired — just proceed as guest
    }
  }
  next();
}

module.exports = router;
