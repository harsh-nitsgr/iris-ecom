/**
 * seed-products.js
 * Seeds all 9 products from the static catalog into MongoDB.
 * Downloads and uploads all images to Cloudinary first.
 * Run: node seed-products.js
 */
require('dotenv').config();
const mongoose = require('mongoose');

// Sample Unsplash fashion images for each product slot
const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1583496661160-fb5218bebd21?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515347619362-e674149faabc?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1434389673966-2673a38ce30e?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?q=80&w=800&auto=format&fit=crop',
];

const PRODUCTS_DATA = [
  { name: 'Hand-embroidered Linen Dress',  price: 4500, category: 'Dresses',    tag: 'New',        isNewArrival: true,  isTrending: true,  sizes: [{size:'XS',countInStock:2},{size:'S',countInStock:5},{size:'M',countInStock:0},{size:'L',countInStock:3}], imgIdx: [0,1] },
  { name: 'Minimalist Cotton Co-ord',      price: 3200, category: 'Co-ords',    tag: '',           isNewArrival: false, isTrending: false, sizes: [{size:'S',countInStock:10},{size:'M',countInStock:8},{size:'L',countInStock:4}], imgIdx: [2,3] },
  { name: 'Elegant Chikankari Top',        price: 2800, category: 'Tops',       tag: 'Bestseller', isNewArrival: true,  isTrending: false, sizes: [{size:'XS',countInStock:6},{size:'S',countInStock:4},{size:'M',countInStock:7},{size:'L',countInStock:0}], imgIdx: [4,5] },
  { name: 'Pleated Evening Gown',          price: 8200, category: 'Party Wear', tag: '',           isNewArrival: false, isTrending: true,  sizes: [{size:'S',countInStock:2},{size:'M',countInStock:3},{size:'L',countInStock:1}], imgIdx: [6,7] },
  { name: 'Block Print Maxi',              price: 5400, category: 'Dresses',    tag: '',           isNewArrival: false, isTrending: true,  sizes: [{size:'S',countInStock:5},{size:'M',countInStock:5},{size:'L',countInStock:3},{size:'XL',countInStock:2}], imgIdx: [8,0] },
  { name: 'Floral Thread Kurta Set',       price: 3900, category: 'Co-ords',    tag: 'New',        isNewArrival: true,  isTrending: false, sizes: [{size:'XS',countInStock:3},{size:'S',countInStock:6},{size:'M',countInStock:4}], imgIdx: [1,2] },
  { name: 'Ivory Embroidered Midi',        price: 5900, category: 'Dresses',    tag: 'New',        isNewArrival: true,  isTrending: true,  sizes: [{size:'XS',countInStock:0},{size:'S',countInStock:3},{size:'M',countInStock:5},{size:'L',countInStock:2}], imgIdx: [3,4] },
  { name: 'Structured Chikankari Top',     price: 3100, category: 'Tops',       tag: '',           isNewArrival: false, isTrending: false, sizes: [{size:'XS',countInStock:5},{size:'S',countInStock:8},{size:'M',countInStock:3}], imgIdx: [5,6] },
  { name: 'Heritage Wrap Dress',           price: 6700, category: 'Dresses',    tag: 'Bestseller', isNewArrival: false, isTrending: true,  sizes: [{size:'S',countInStock:4},{size:'M',countInStock:4},{size:'L',countInStock:3},{size:'XL',countInStock:1}], imgIdx: [7,8] },
];

const DESCRIPTIONS = {
  'Hand-embroidered Linen Dress': 'A beautifully crafted western silhouette dress made from handwoven linen. Features delicate traditional Chikankari hand-embroidery along the neckline and seams.',
  'Minimalist Cotton Co-ord': 'A matching two-piece co-ord set in soft breathable cotton. Subtle Chikankari embroidery at the cuffs and hem adds an elegant artisan touch.',
  'Elegant Chikankari Top': 'A flowy, lightweight top with signature Chikankari embroidery across the front panel. Pair it with high-waisted trousers or denim.',
  'Pleated Evening Gown': 'A showstopping evening gown featuring floor-length pleated fabric adorned with fine Chikankari floral motifs.',
  'Block Print Maxi': 'A relaxed fit maxi dress with traditional block-print patterns blended with delicate Chikankari embroidery — the perfect fusion of craft and contemporary style.',
  'Floral Thread Kurta Set': 'A classic Chikankari kurta set with delicate floral thread work. Comes with a matching bottom for a coordinated western look.',
  'Ivory Embroidered Midi': 'An ivory midi dress with all-over fine Chikankari embroidery. Flowing silhouette ideal for both day and evening occasions.',
  'Structured Chikankari Top': 'A semi-structured cropped top with dimensional Chikankari embroidery. Designed to be the centrepiece of any outfit.',
  'Heritage Wrap Dress': 'A timeless wrap-style dress inspired by mughal art heritage. Dense floral Chikankari embroidery frames the waist and hem.',
};

const uploadToCloudinary = async (cloudinary, url) => {
  if (url.includes('res.cloudinary.com')) return url;
  try {
    console.log(`    ⬆ Uploading ${url.slice(0, 60)}...`);
    const result = await cloudinary.uploader.upload(url, {
      folder: 'chickenkari-ecommerce',
      resource_type: 'image',
    });
    console.log(`    ✅ ${result.secure_url.slice(0, 60)}`);
    return result.secure_url;
  } catch (e) {
    console.warn(`    ⚠️ Upload failed: ${e.message} — using original URL`);
    return url;
  }
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected\n');

  const User    = require('./models/User');
  const Brand   = require('./models/Brand');
  const Product = require('./models/Product');
  const cloudinary = require('./config/cloudinary');

  // Clear existing products only
  await Product.deleteMany({});
  console.log('🗑  Cleared existing products\n');

  // Get or create admin user
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    adminUser = await User.create({ name: 'Admin', email: 'admin@iris.com', password: 'Admin@123', role: 'admin' });
    console.log('👤 Created admin user: admin@iris.com / Admin@123');
  }

  // Get or create brand
  let brand = await Brand.findOne({ name: 'Iris' });
  if (!brand) {
    brand = await Brand.create({
      name: 'Iris',
      description: 'Western fashion with an Indian craft soul',
      logo: { url: 'https://via.placeholder.com/100', public_id: 'iris_logo' },
      isFeatured: true,
    });
    console.log('🏷  Created brand: Iris\n');
  }

  // Pre-upload all unique images to Cloudinary
  console.log('📸 Pre-uploading images to Cloudinary...\n');
  const uploadedImages = {};
  const uniqueIdxs = [...new Set(PRODUCTS_DATA.flatMap(p => p.imgIdx))];
  for (const idx of uniqueIdxs) {
    const url = IMAGE_POOL[idx];
    if (!uploadedImages[idx]) {
      uploadedImages[idx] = await uploadToCloudinary(cloudinary, url);
    }
  }

  // Insert all 9 products
  console.log('\n🌱 Seeding 9 products...\n');
  for (const p of PRODUCTS_DATA) {
    const images = p.imgIdx.map(i => uploadedImages[i]);
    await Product.create({
      user: adminUser._id,
      brand: brand._id,
      name: p.name,
      category: p.category,
      description: DESCRIPTIONS[p.name],
      price: p.price,
      images,
      sizes: p.sizes,
      isTrending: p.isTrending,
      isNewArrival: p.isNewArrival,
    });
    console.log(`  ✓ ${p.name} (${images.length} images)`);
  }

  const total = await Product.countDocuments();
  console.log(`\n🎉 Done! ${total} products in database.\n`);
  process.exit(0);
};

run().catch(e => { console.error('Error:', e.message); process.exit(1); });
