const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a brand name'],
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a brand description'],
    },
    logo: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Brand', brandSchema);
