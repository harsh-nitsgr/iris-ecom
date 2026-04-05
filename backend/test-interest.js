require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const Product = require('./models/Product');
  const ProductInterest = require('./models/ProductInterest');
  
  const product = await Product.findOne();
  if (!product) return process.exit(1);
  
  const productId = product._id.toString();
  console.log('Testing with product ID:', productId);

  // simulate click
  await ProductInterest.findOneAndUpdate(
    { productId },
    {
      $setOnInsert: { productId, productName: product.name },
      $inc: { totalClicks: 1 },
      $push: { clicks: { clickedAt: new Date() } }
    },
    { upsert: true, new: true }
  );

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
        image: { $arrayElemAt: ["$productDetails.images", 0] }
      }
    }
  ]);

  console.log('Aggregation result:');
  console.log(JSON.stringify(interests, null, 2));
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
