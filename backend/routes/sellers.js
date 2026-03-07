import express from 'express';
import { getSeller } from '../services/sellers.js';
import { getProductsBySeller } from '../services/dynamodb.js';

const router = express.Router();

// Get seller profile
router.get('/:sellerId', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await getSeller(sellerId);
    
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found' });
    }

    res.json({
      success: true,
      seller
    });
  } catch (error) {
    console.error('Error getting seller:', error);
    res.status(500).json({ error: 'Failed to get seller' });
  }
});

// Get seller's products
router.get('/:sellerId/products', async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await getProductsBySeller(sellerId);
    
    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Error getting seller products:', error);
    res.status(500).json({ error: 'Failed to get products' });
  }
});

export default router;
