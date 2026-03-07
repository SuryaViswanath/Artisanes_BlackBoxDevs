import express from 'express';
import { generateSellerProfile } from '../services/bedrock.js';
import { updateSellerProfile } from '../services/sellers.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory conversation storage for profile setup
const profileConversations = new Map();

router.post('/start', async (req, res) => {
  try {
    const { sellerId, sellerName, businessName } = req.body;
    
    const conversationId = uuidv4();
    const conversation = {
      conversationId,
      sellerId,
      messages: [],
      profileData: {},
      questionsAsked: 0,
      createdAt: new Date().toISOString()
    };
    
    profileConversations.set(conversationId, conversation);
    
    const initialMessage = `Hello ${sellerName}! I'm excited to learn about your craft and story. This will help create authentic product listings that truly represent your work.

Let's start with the basics - what kind of products do you create, and what inspired you to become an artisan?`;
    
    conversation.messages.push({
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      conversationId,
      message: initialMessage
    });
    
  } catch (error) {
    console.error('Error starting profile conversation:', error);
    res.status(500).json({
      error: 'Failed to start profile conversation',
      message: error.message
    });
  }
});

router.post('/message', async (req, res) => {
  try {
    const { conversationId, sellerId, message } = req.body;
    
    if (!conversationId || !message) {
      return res.status(400).json({
        error: 'conversationId and message are required'
      });
    }
    
    const conversation = profileConversations.get(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }
    
    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    conversation.questionsAsked++;
    
    // Generate AI response
    const aiResult = await generateSellerProfile(
      conversation.messages,
      message,
      conversation.questionsAsked
    );
    
    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResult.response,
      timestamp: new Date().toISOString()
    });
    
    // Check if profile is complete (after 5-6 exchanges)
    const profileComplete = conversation.questionsAsked >= 5;
    
    if (profileComplete && aiResult.profile) {
      // Save profile to seller
      await updateSellerProfile(sellerId, aiResult.profile);
      
      res.json({
        success: true,
        message: aiResult.response,
        profileComplete: true,
        profile: aiResult.profile
      });
    } else {
      res.json({
        success: true,
        message: aiResult.response,
        profileComplete: false
      });
    }
    
  } catch (error) {
    console.error('Error processing profile message:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
});

export default router;
