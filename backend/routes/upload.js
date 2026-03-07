import express from 'express';
import multer from 'multer';
import { uploadToS3 } from '../services/s3.js';
import { transcribeAudio } from '../services/transcribe.js';
import { generateListing } from '../services/bedrock.js';
import { saveProduct } from '../services/dynamodb.js';
import { updateSellerProductCount } from '../services/sellers.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Upload photos and voice, then generate listing
router.post('/generate-listing', upload.fields([
  { name: 'photos', maxCount: 3 },
  { name: 'voice', maxCount: 1 }
]), async (req, res) => {
  try {
    const productId = uuidv4();
    const photos = req.files['photos'] || [];
    const voice = req.files['voice'] ? req.files['voice'][0] : null;
    const sellerId = req.body.sellerId; // Get seller ID from request

    if (photos.length === 0) {
      return res.status(400).json({ error: 'At least one photo is required' });
    }

    if (!voice) {
      return res.status(400).json({ error: 'Voice note is required' });
    }

    if (!sellerId) {
      return res.status(400).json({ error: 'Seller ID is required' });
    }

    // Upload photos to S3
    const photoUrls = [];
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const key = `products/${productId}/photo-${i + 1}.jpg`;
      const url = await uploadToS3(photo.buffer, key, photo.mimetype);
      photoUrls.push(url);
    }

    // Upload voice to S3
    const voiceKey = `products/${productId}/voice.webm`;
    const voiceUrl = await uploadToS3(voice.buffer, voiceKey, voice.mimetype);

    // Transcribe voice note
    const transcription = await transcribeAudio(voiceUrl);

    // Generate listing using Bedrock AI
    const listing = await generateListing({
      transcription,
      photoUrls,
      productId
    });

    // Save product to DynamoDB
    const product = {
      productId,
      sellerId,
      photoUrls,
      voiceUrl,
      transcription,
      listing,
      createdAt: new Date().toISOString(),
      status: 'published'  // Auto-publish for POC
    };

    await saveProduct(product);
    
    // Update seller's product count
    await updateSellerProductCount(sellerId, 1);

    res.json({
      success: true,
      productId,
      listing,
      photoUrls
    });

  } catch (error) {
    console.error('Error generating listing:', error);
    res.status(500).json({ 
      error: 'Failed to generate listing',
      message: error.message 
    });
  }
});

export default router;
