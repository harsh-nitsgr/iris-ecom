const ProductInterest = require('../models/ProductInterest');

// @desc    Record a "Show Interest" click
// @route   POST /api/interests/:productId
// @access  Public (softProtect — works for guests too)
const recordInterest = async (req, res) => {
  const { productId } = req.params;
  const { size, productName } = req.body;  // frontend sends productName from static catalog

  try {
    const clickEntry = {
      size: size || null,
      clickedAt: new Date(),
    };

    if (req.user) {
      clickEntry.userId = String(req.user._id);
      clickEntry.userEmail = req.user.email;
    }

    const interest = await ProductInterest.findOneAndUpdate(
      { productId },
      {
        $setOnInsert: { productId, productName: productName || 'Unknown' },
        $inc: { totalClicks: 1 },
        $push: { clicks: clickEntry },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: 'Interest recorded',
      totalClicks: interest.totalClicks,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get detailed interest for one product
// @route   GET /api/interests/:productId
// @access  Private/Admin
const getProductInterest = async (req, res) => {
  try {
    const interest = await ProductInterest.findOne({ productId: req.params.productId });
    if (!interest) return res.json({ productId: req.params.productId, totalClicks: 0, clicks: [] });
    res.json(interest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    All products sorted by interest (leaderboard)
// @route   GET /api/interests
// @access  Private/Admin
const getAllInterests = async (req, res) => {
  try {
    const interests = await ProductInterest.aggregate([
      {
        $addFields: {
          productObjectId: {
            $convert: { input: "$productId", to: "objectId", onError: null, onNull: null }
          }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "productObjectId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          productId: 1,
          productName: 1,
          totalClicks: 1,
          updatedAt: 1,
          image: { $arrayElemAt: ["$productDetails.images", 0] }
        }
      },
      { $sort: { totalClicks: -1 } }
    ]);
    res.json(interests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordInterest, getProductInterest, getAllInterests };
