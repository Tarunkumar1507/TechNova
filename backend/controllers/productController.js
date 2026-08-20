const mongoose = require('mongoose');
const Product = require('../models/Product');
const sampleProducts = require('../services/seeder').sampleProducts;

// Helper: check if mongoose is connected
const isDBConnected = () => mongoose.connection.readyState === 1;

// Generate simple numeric IDs for in-memory products if needed
const inMemoryProducts = sampleProducts.map((p, idx) => ({
  ...p,
  _id: `static-product-${idx + 1}`,
  averageRating: 0,
  reviewCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

// @desc    Get all products (with optional filtering)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    // --- Fallback: DB not connected, use in-memory data ---
    if (!isDBConnected()) {
      let products = [...inMemoryProducts];

      if (category) {
        products = products.filter(
          (p) => p.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (search) {
        const term = search.toLowerCase();
        products = products.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.brand.toLowerCase().includes(term)
        );
      }

      return res.json({ success: true, count: products.length, data: products });
    }

    // --- Primary: fetch from MongoDB ---
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(query);
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    // Fallback: in-memory lookup by static id
    if (!isDBConnected()) {
      const product = inMemoryProducts.find((p) => p._id === req.params.id);
      if (product) {
        return res.json({ success: true, data: product });
      } else {
        res.status(404);
        throw new Error('Product not found');
      }
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      res.json({ success: true, data: product });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      res.status(503);
      throw new Error('Database not connected. Cannot create products in demo mode.');
    }

    const { name, brand, category, description, price, image, stock } = req.body;

    if (!name || !brand || !category || !description || !price || !image) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const product = new Product({
      name,
      brand,
      category,
      description,
      price,
      image,
      stock: stock || 0,
      averageRating: 0,
      reviewCount: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json({ success: true, data: createdProduct });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      res.status(503);
      throw new Error('Database not connected. Cannot update products in demo mode.');
    }

    const { name, brand, category, description, price, image, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.description = description || product.description;
      product.price = price !== undefined ? price : product.price;
      product.image = image || product.image;
      product.stock = stock !== undefined ? stock : product.stock;

      const updatedProduct = await product.save();
      res.json({ success: true, data: updatedProduct });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    if (!isDBConnected()) {
      res.status(503);
      throw new Error('Database not connected. Cannot delete products in demo mode.');
    }

    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Product removed' });
    } else {
      res.status(404);
      throw new Error('Product not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

