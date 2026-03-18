const mongoose = require('mongoose');

/**
 * ProductInterest — tracks "Show Interest" clicks per product.
 * productId is a String (not ObjectId) so it works with both
 * MongoDB-stored products AND the static frontend catalog (prod001, etc.)
 */
const productInterestSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    productName: String,
    totalClicks: {
      type: Number,
      default: 0,
      index: true,
    },
    clicks: [
      {
        userId: {
          type: String,       // store as string — avoids ObjectId cast issues for guest clicks
          default: null,
        },
        userEmail: String,
        size: String,
        clickedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductInterest', productInterestSchema);
