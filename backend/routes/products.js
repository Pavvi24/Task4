const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// ✅ GET ALL PRODUCTS (with filters, pagination, featured)
router.get('/', async (req, res) => {
  try {
    const { featured, page = 1, limit = 12 } = req.query;

    let query = {};

    // Handle featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ✅ GET PRODUCT CATEGORIES
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.distinct('category');

    res.json({
      success: true,
      categories
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
