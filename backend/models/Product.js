const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Dresses', 'Tops', 'Co-ords', 'Party Wear', 'Casual Wear'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      default: 0,
    },
    images: [{ type: String }],
    sizes: [
      {
        size: { type: String, required: true },
        countInStock: { type: Number, required: true, default: 0 },
      },
    ],
    isTrending: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    fabricAndCare: {
      type: String,
      default: '',
    },
    shippingAndReturns: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
