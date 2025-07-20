// routes/wishlist.js
import express from 'express';
import Wishlist from '../models/Wishlist.js';
import authenticateToken from '../middleware/auth.js'; // ✅ correct import
const router = express.Router();

router.use(authenticateToken);

// Get all wishlist items for a user
router.get('/:userId', async (req, res) => {
  try {
    const items = await Wishlist.findAll({ where: { userId: req.params.userId } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add a product to the wishlist
router.post('/', async (req, res) => {
  try {
    const { userId, product_id, product_name, product_price, product_image } = req.body;

    // Check for duplicate
    const existing = await Wishlist.findOne({
      where: { userId, product_id }
    });
    if (existing) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    const item = await Wishlist.create({
      userId, product_id, product_name, product_price, product_image
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// Remove a product from wishlist
router.delete('/:userId/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const result = await Wishlist.destroy({
      where: { userId, product_id: productId }
    });
    if (result) {
      res.json({ message: 'Product removed from wishlist' });
    } else {
      res.status(404).json({ message: 'Product not found in wishlist' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

export default router;
