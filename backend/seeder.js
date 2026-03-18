const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Brand = require('./models/Brand');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Brand.deleteMany();

    const createdUsers = await User.create([
      {
        name: 'Admin User',
        email: 'admin@chickenkari.com',
        password: 'password123',
        role: 'admin',
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user',
      }
    ]);

    const adminUser = createdUsers[0]._id;

    const brand = await Brand.create({
      name: 'Anavila',
      description: 'Handwoven Linen',
      logo: { url: 'https://images.unsplash.com/photo-1544441584-601eab402772?q=80&w=100&auto=format&fit=crop', public_id: 'brand_sample' },
      isFeatured: true
    });

    const sampleProducts = [
      {
        user: adminUser,
        name: 'Hand-embroidered Linen Dress',
        brand: brand._id,
        category: 'Dresses',
        description: 'A beautifully crafted western silhouette dress made from handwoven linen. Features delicate traditional hand-embroidery along the seams.',
        price: 4500,
        images: [
          { url: 'https://images.unsplash.com/photo-1515347619362-e674149faabc?q=80&w=800&auto=format&fit=crop', public_id: 'sample1' },
          { url: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=800&auto=format&fit=crop', public_id: 'sample2' }
        ],
        sizes: [
          { size: 'S', countInStock: 5 },
          { size: 'M', countInStock: 3 },
          { size: 'L', countInStock: 0 },
        ],
        isTrending: true,
        isNewArrival: false,
      },
      {
        user: adminUser,
        name: 'Minimalist Cotton Co-ord',
        brand: brand._id,
        category: 'Co-ords',
        description: 'Perfect for warm summer evenings. Relaxed fit.',
        price: 3200,
        images: [
          { url: 'https://images.unsplash.com/photo-1434389673966-2673a38ce30e?q=80&w=800&auto=format&fit=crop', public_id: 'sample3' }
        ],
        sizes: [
          { size: 'S', countInStock: 10 },
          { size: 'M', countInStock: 8 },
        ],
        isTrending: false,
        isNewArrival: true,
      }
    ];

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
