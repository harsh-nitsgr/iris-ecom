const Product = require('../models/Product');
const Brand   = require('../models/Brand'); // must be imported so Mongoose registers the schema before .populate('brand')
const User    = require('../models/User');


// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const filter = { ...keyword, ...category };

    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('brand', 'name');

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('brand', 'name description logo')
      .populate('user', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, images, sizes, isTrending, isNewArrival, fabricAndCare, shippingAndReturns } = req.body;

    // Resolve brand: find existing 'Iris' brand or the first brand in DB
    let brandDoc = await Brand.findOne({ name: 'Iris' }) || await Brand.findOne();
    if (!brandDoc) {
      brandDoc = await Brand.create({
        name: 'Iris',
        description: 'Iris — Western fashion with Indian craft soul',
        logo: { url: 'https://via.placeholder.com/100', public_id: 'iris_logo' },
      });
    }

    // Admin user: use req.user if authenticated, else fall back to any admin
    const userId = req.user?._id || (await User.findOne({ role: 'admin' }))?._id;

    const product = new Product({
      name: name || 'New Product',
      price: price || 0,
      user: userId,
      images: images || [],
      brand: brandDoc._id,
      category: category || 'Dresses',
      sizes: sizes || [],
      description: description || '',
      isTrending: isTrending || false,
      isNewArrival: isNewArrival || false,
      fabricAndCare: fabricAndCare || '',
      shippingAndReturns: shippingAndReturns || '',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const { name, price, description, images, category, sizes, isTrending, isNewArrival, fabricAndCare, shippingAndReturns } = req.body;
  // Note: we intentionally ignore req.body.brand (it's always 'Iris' — resolved from DB)

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name        = name        !== undefined ? name        : product.name;
      product.price       = price       !== undefined ? price       : product.price;
      product.description = description !== undefined ? description : product.description;
      product.images      = images      !== undefined ? images      : product.images;
      product.category    = category    !== undefined ? category    : product.category;
      product.sizes       = sizes       !== undefined ? sizes       : product.sizes;
      product.isTrending    = isTrending    !== undefined ? isTrending    : product.isTrending;
      product.isNewArrival  = isNewArrival  !== undefined ? isNewArrival  : product.isNewArrival;
      product.fabricAndCare      = fabricAndCare      !== undefined ? fabricAndCare      : product.fabricAndCare;
      product.shippingAndReturns = shippingAndReturns !== undefined ? shippingAndReturns : product.shippingAndReturns;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending products
// @route   GET /api/products/trending/all
// @access  Public
const getTrendingProducts = async (req, res) => {
  try {
    const products = await Product.find({ isTrending: true }).limit(8).populate('brand', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTrendingProducts,
};
