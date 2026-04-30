const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ✅ GET ALL PRODUCTS (with filters)
router.get('/', async (req, res) => {
  try {
    const { featured, page = 1, limit = 10, sort } = req.query;

    let query = {};

    // featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    let productsQuery = Product.find(query);

    // sorting
    if (sort === 'newest') {
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    // pagination
    const skip = (page - 1) * limit;
    productsQuery = productsQuery.skip(skip).limit(Number(limit));

    const products = await productsQuery;

    res.json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET CATEGORIES
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
