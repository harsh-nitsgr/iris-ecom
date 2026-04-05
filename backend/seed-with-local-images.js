/**
 * seed-with-local-images.js
 * Uploads local /frontend/public/products/prod1-9.jpg to Cloudinary
 * and seeds 9 products with those real images.
 * Run: node seed-with-local-images.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Map each product to its local image files
const LOCAL_IMAGE_MAP = {
  'Hand-embroidered Linen Dress':  ['prod4.jpg', 'prod1.jpg'],
  'Minimalist Cotton Co-ord':      ['prod5.jpg', 'prod2.jpg'],
  'Elegant Chikankari Top':        ['prod6.jpg', 'prod3.jpg'],
  'Pleated Evening Gown':          ['prod7.jpg', 'prod8.jpg'],
  'Block Print Maxi':              ['prod8.jpg', 'prod4.jpg'],
  'Floral Thread Kurta Set':       ['prod9.jpg', 'prod5.jpg'],
  'Ivory Embroidered Midi':        ['prod1.jpg', 'prod6.jpg'],
  'Structured Chikankari Top':     ['prod2.jpg', 'prod9.jpg'],
  'Heritage Wrap Dress':           ['prod3.jpg', 'prod7.jpg'],
};

const PRODUCTS_DATA = [
  { name: 'Hand-embroidered Linen Dress',  price: 4500, category: 'Dresses',    isTrending: true,  isNewArrival: true,  sizes: [{size:'XS',countInStock:2},{size:'S',countInStock:5},{size:'M',countInStock:0},{size:'L',countInStock:3}],             description: 'A beautifully crafted western silhouette dress made from handwoven linen. Features delicate traditional Chikankari hand-embroidery along the neckline and seams. Breathable fabric, ideal for warm summer evenings or casual brunches.' },
  { name: 'Minimalist Cotton Co-ord',      price: 3200, category: 'Co-ords',    isTrending: false, isNewArrival: false, sizes: [{size:'S',countInStock:10},{size:'M',countInStock:8},{size:'L',countInStock:4}],                                          description: 'A matching two-piece co-ord set in soft breathable cotton. Subtle Chikankari embroidery at the cuffs and hem adds an elegant artisan touch to this everyday modern silhouette.' },
  { name: 'Elegant Chikankari Top',        price: 2800, category: 'Tops',       isTrending: false, isNewArrival: true,  sizes: [{size:'XS',countInStock:6},{size:'S',countInStock:4},{size:'M',countInStock:7},{size:'L',countInStock:0}],              description: 'A flowy, lightweight top with signature Chikankari embroidery across the front panel. Pair it with high-waisted trousers or denim for an effortlessly elevated look.' },
  { name: 'Pleated Evening Gown',          price: 8200, category: 'Party Wear', isTrending: true,  isNewArrival: false, sizes: [{size:'S',countInStock:2},{size:'M',countInStock:3},{size:'L',countInStock:1}],                                          description: 'A showstopping evening gown featuring floor-length pleated fabric adorned with fine Chikankari floral motifs. Designed to make a statement at any occasion.' },
  { name: 'Block Print Maxi',              price: 5400, category: 'Dresses',    isTrending: true,  isNewArrival: false, sizes: [{size:'S',countInStock:5},{size:'M',countInStock:5},{size:'L',countInStock:3},{size:'XL',countInStock:2}],               description: 'A relaxed fit maxi dress with traditional block-print patterns blended with delicate Chikankari embroidery. The perfect fusion of craft and contemporary style.' },
  { name: 'Floral Thread Kurta Set',       price: 3900, category: 'Co-ords',    isTrending: false, isNewArrival: true,  sizes: [{size:'XS',countInStock:3},{size:'S',countInStock:6},{size:'M',countInStock:4}],                                         description: 'A classic Chikankari kurta set with delicate floral thread work. The set comes with a matching bottom for a coordinated look with western sensibilities.' },
  { name: 'Ivory Embroidered Midi',        price: 5900, category: 'Dresses',    isTrending: true,  isNewArrival: true,  sizes: [{size:'XS',countInStock:0},{size:'S',countInStock:3},{size:'M',countInStock:5},{size:'L',countInStock:2}],               description: 'An ivory midi dress with all-over fine Chikankari embroidery. The subtle sheerness and flowing silhouette make it ideal for both day and evening occasions.' },
  { name: 'Structured Chikankari Top',     price: 3100, category: 'Tops',       isTrending: false, isNewArrival: false, sizes: [{size:'XS',countInStock:5},{size:'S',countInStock:8},{size:'M',countInStock:3}],                                         description: 'A semi-structured cropped top with dimensional Chikankari embroidery. Designed to be the centrepiece of any outfit — pair with palazzos or wide-leg trousers.' },
  { name: 'Heritage Wrap Dress',           price: 6700, category: 'Dresses',    isTrending: true,  isNewArrival: false, sizes: [{size:'S',countInStock:4},{size:'M',countInStock:4},{size:'L',countInStock:3},{size:'XL',countInStock:1}],               description: 'A timeless wrap-style dress inspired by Mughal art heritage. Dense floral Chikankari embroidery frames the waist and hem. A collector-worthy piece.' },
];

const IMAGES_DIR = path.join(__dirname, '../frontend/public/products');

const uploadLocalFile = async (cloudinary, filename) => {
  const filepath = path.join(IMAGES_DIR, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`    ⚠️ File not found: ${filename}`);
    return null;
  }
  // Check if already uploaded — search Cloudinary by public_id pattern
  const publicId = `chickenkari-ecommerce/${path.basename(filename, path.extname(filename))}`;
  try {
    const existing = await cloudinary.api.resource(publicId);
    console.log(`    ⏭  Already on Cloudinary: ${filename}`);
    return existing.secure_url;
  } catch {
    // Not found — upload it
  }

  try {
    console.log(`    ⬆ Uploading ${filename}...`);
    const result = await cloudinary.uploader.upload(filepath, {
      folder: 'chickenkari-ecommerce',
      public_id: path.basename(filename, path.extname(filename)),
      overwrite: true,
      resource_type: 'image',
    });
    console.log(`    ✅ ${result.secure_url.slice(0, 70)}`);
    return result.secure_url;
  } catch (e) {
    console.warn(`    ⚠️ Upload failed for ${filename}: ${e.message}`);
    return `/products/${filename}`; // fallback to local path
  }
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB connected\n');

  const User    = require('./models/User');
  const Brand   = require('./models/Brand');
  const Product = require('./models/Product');
  const cloudinary = require('./config/cloudinary');

  // Cache of uploaded filenames → cloudinary URLs
  const urlCache = {};

  // Pre-upload all unique images
  console.log('📸 Uploading product images from frontend/public/products/...\n');
  const allFiles = [...new Set(Object.values(LOCAL_IMAGE_MAP).flat())];
  for (const file of allFiles) {
    if (!urlCache[file]) {
      urlCache[file] = await uploadLocalFile(cloudinary, file);
    }
  }

  // Get/create admin user
  let adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) {
    adminUser = await User.create({ name: 'Admin', email: 'admin@iris.com', password: 'Admin@123', role: 'admin' });
    console.log('\n👤 Created admin: admin@iris.com / Admin@123');
  }

  // Get/create brand
  let brand = await Brand.findOne({ name: 'Iris' }).catch(() => null);
  if (!brand) {
    brand = await Brand.create({
      name: 'Iris',
      description: 'Western fashion with an Indian craft soul',
      logo: { url: 'https://via.placeholder.com/100', public_id: 'iris_logo' },
      isFeatured: true,
    });
  }

  // Clear & re-seed products
  await Product.deleteMany({});
  console.log('\n🗑  Cleared old products');
  console.log('🌱 Seeding 9 products...\n');

  for (const p of PRODUCTS_DATA) {
    const imgFiles = LOCAL_IMAGE_MAP[p.name] || [];
    const images = imgFiles.map(f => urlCache[f]).filter(Boolean);

    await Product.create({
      user: adminUser._id,
      brand: brand._id,
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      images,
      sizes: p.sizes,
      isTrending: p.isTrending,
      isNewArrival: p.isNewArrival,
    });
    console.log(`  ✓ ${p.name} — ${images.length} image(s)`);
  }

  const total = await Product.countDocuments();
  console.log(`\n🎉 Done! ${total} products in database with real images.\n`);
  process.exit(0);
};

run().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
