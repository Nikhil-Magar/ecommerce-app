const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all categories (unique categories from products)
router.get('/', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET products count by category
router.get('/stats', async (req, res) => {
  try {
    const stats = await Product.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;