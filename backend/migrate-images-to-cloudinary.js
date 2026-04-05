/**
 * migrate-images-to-cloudinary.js
 * 
 * Migrates all product images to Cloudinary.
 * Handles old schema {url, public_id} objects AND plain string URLs.
 * Updates the DB to use plain Cloudinary URL strings.
 * 
 * Run: node migrate-images-to-cloudinary.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected');

  require('./models/Brand');
  const Product  = require('./models/Product');
  const cloudinary = require('./config/cloudinary');

  const products = await Product.find({}).lean();
  console.log(`\n📦 Found ${products.length} products\n`);

  let updated = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`\n[${i + 1}/${products.length}] ${product.name}`);

    const raw = product.images || [];
    const newImages = [];
    let changed = false;

    for (const img of raw) {
      // Resolve URL: handle both {url, public_id} objects and plain strings
      const imgUrl = (typeof img === 'object' && img !== null) ? (img.url || '') : (img || '');

      if (!imgUrl) { continue; }

      // Already on Cloudinary — convert object to string URL
      if (imgUrl.includes('res.cloudinary.com')) {
        console.log(`  ⏭  Already Cloudinary`);
        newImages.push(imgUrl);
        if (typeof img === 'object') changed = true; // still need to flatten to string
        continue;
      }

      try {
        console.log(`  ⬆  Uploading: ${imgUrl.slice(0, 80)}`);
        const result = await cloudinary.uploader.upload(imgUrl, {
          folder: 'chickenkari-ecommerce',
          resource_type: 'image',
        });
        console.log(`  ✅ → ${result.secure_url.slice(0, 70)}`);
        newImages.push(result.secure_url);
        changed = true;
      } catch (err) {
        console.warn(`  ⚠️  Upload failed: ${err.message} — keeping original URL`);
        newImages.push(imgUrl); // keep as plain string even if upload fails
        if (typeof img === 'object') changed = true;
      }
    }

    if (changed || raw.length !== newImages.length) {
      // Use updateOne to bypass schema validation on old data
      await Product.collection.updateOne(
        { _id: product._id },
        { $set: { images: newImages } }
      );
      console.log(`  💾 Saved (${newImages.length} images)`);
      updated++;
    } else {
      console.log(`  ✓ No changes`);
    }
  }

  console.log(`\n🎉 Migration complete! ${updated}/${products.length} products updated.\n`);
  process.exit(0);
};

run().catch(err => {
  console.error('Fatal migration error:', err.message);
  console.error(err.stack);
  process.exit(1);
});
