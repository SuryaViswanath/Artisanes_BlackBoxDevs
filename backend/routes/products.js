import express from 'express';
import { getAllProducts, getProduct } from '../services/dynamodb.js';

const router = express.Router();

// Get all published products
router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    
    res.json({
      success: true,
      products,
      count: products.length
    });
  } catch (error) {
    console.error('Error getting products:', error);
    
    // Return mock products if database fails
    const mockProducts = generateMockProducts();
    res.json({
      success: true,
      products: mockProducts,
      count: mockProducts.length,
      note: 'Using mock data - configure DynamoDB for real products'
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProduct(id);
    
    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      error: 'Failed to get product',
      message: error.message
    });
  }
});

// Generate mock products for testing
function generateMockProducts() {
  return [
    {
      productId: 'mock-1',
      listing: {
        title: 'Handcrafted Traditional Clay Pot - Natural Red Clay Water Storage',
        description: 'This beautiful clay pot is handcrafted using traditional pottery techniques passed down through generations. Made from natural red clay sourced from local riverbanks, each piece is unique and perfect for storing water naturally.',
        bulletPoints: [
          '100% Handmade using traditional pottery wheel techniques',
          'Made from natural red clay sourced locally',
          'Perfect for natural water storage - keeps water cool',
          'Each piece unique with 3 hours of dedicated craftsmanship',
          'Eco-friendly and supports traditional artisans'
        ],
        tags: ['handmade', 'clay-pot', 'traditional', 'pottery', 'eco-friendly'],
        category: 'Home & Kitchen',
        storyCard: 'Meet the artisan who crafted this unique piece using time-honored techniques passed down through generations. Each pot is shaped by hand on a traditional pottery wheel.'
      },
      photoUrls: [
        'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400',
        'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400'
      ],
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      amazonUrl: 'https://amazon.com/dp/EXAMPLE1'
    },
    {
      productId: 'mock-2',
      listing: {
        title: 'Handwoven Cotton Table Runner - Natural Dyes Traditional Textile',
        description: 'Beautiful handwoven table runner crafted on a traditional loom using 100% cotton threads and natural plant-based dyes. Each piece takes 2 weeks to complete and showcases intricate patterns.',
        bulletPoints: [
          'Handwoven on traditional loom with 100% cotton',
          'Natural plant-based dyes - eco-friendly colors',
          'Intricate traditional patterns unique to each piece',
          '2 weeks of dedicated craftsmanship',
          'Perfect for dining table or wall hanging'
        ],
        tags: ['handwoven', 'textile', 'cotton', 'natural-dyes', 'table-runner'],
        category: 'Home Décor',
        storyCard: 'This textile represents generations of weaving tradition. Using natural dyes from plants and flowers, each color tells a story of sustainable craftsmanship.'
      },
      photoUrls: [
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400',
        'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=400'
      ],
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      amazonUrl: 'https://amazon.com/dp/EXAMPLE2'
    },
    {
      productId: 'mock-3',
      listing: {
        title: 'Handcrafted Silver Necklace - Semi-Precious Stones Artisan Jewelry',
        description: 'Elegant handcrafted necklace featuring sterling silver and semi-precious stones. Each link is hand-forged using traditional metalworking techniques, creating a unique piece of wearable art.',
        bulletPoints: [
          'Sterling silver hand-forged with traditional techniques',
          'Semi-precious stones carefully selected and set',
          'Adjustable length for perfect fit',
          'Comes in beautiful gift box',
          'Each piece is one-of-a-kind'
        ],
        tags: ['handmade', 'jewelry', 'silver', 'necklace', 'artisan'],
        category: 'Jewelry',
        storyCard: 'Crafted by a skilled metalworker who learned the art from master artisans. Each piece is forged with care, combining traditional techniques with contemporary design.'
      },
      photoUrls: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400'
      ],
      status: 'published',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
      amazonUrl: 'https://amazon.com/dp/EXAMPLE3'
    }
  ];
}

export default router;
