import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { saveSeller, getSellerByEmail } from '../services/sellers.js';

const router = express.Router();

// Simple auth for POC - in production use proper password hashing
router.post('/signup', async (req, res) => {
  try {
    const { email, name, businessName, phone, location } = req.body;

    if (!email || !name) {
      return res.status(400).json({ error: 'Email and name are required' });
    }

    // Check if seller already exists
    const existingSeller = await getSellerByEmail(email);
    if (existingSeller) {
      return res.status(400).json({ error: 'Seller already exists with this email' });
    }

    const seller = {
      sellerId: uuidv4(),
      email,
      name,
      businessName: businessName || name,
      phone: phone || '',
      location: location || '',
      createdAt: new Date().toISOString(),
      productsCount: 0
    };

    await saveSeller(seller);

    res.json({
      success: true,
      seller: {
        sellerId: seller.sellerId,
        email: seller.email,
        name: seller.name,
        businessName: seller.businessName
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create seller account' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const seller = await getSellerByEmail(email);
    
    if (!seller) {
      return res.status(404).json({ error: 'Seller not found. Please sign up first.' });
    }

    res.json({
      success: true,
      seller: {
        sellerId: seller.sellerId,
        email: seller.email,
        name: seller.name,
        businessName: seller.businessName,
        phone: seller.phone,
        location: seller.location,
        productsCount: seller.productsCount
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

export default router;
