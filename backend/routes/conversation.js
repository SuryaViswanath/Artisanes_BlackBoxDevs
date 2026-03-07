import express from 'express';
import { chatWithAI } from '../services/bedrock.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory conversation storage (in production, use DynamoDB)
const conversations = new Map();

// Start a new conversation
router.post('/start', async (req, res) => {
  try {
    const { productId, productContext } = req.body;
    
    const conversationId = uuidv4();
    const conversation = {
      conversationId,
      productId,
      productContext,
      messages: [],
      createdAt: new Date().toISOString()
    };
    
    conversations.set(conversationId, conversation);
    
    // Get initial AI greeting
    const initialMessage = "Hello! I'm here to help you gather some additional details about your product. This information will help create comprehensive FAQs and provide better customer support. Shall we get started?";
    
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
    console.error('Error starting conversation:', error);
    res.status(500).json({
      error: 'Failed to start conversation',
      message: error.message
    });
  }
});

// Send a message in the conversation
router.post('/message', async (req, res) => {
  try {
    const { conversationId, message } = req.body;
    
    if (!conversationId || !message) {
      return res.status(400).json({
        error: 'conversationId and message are required'
      });
    }
    
    const conversation = conversations.get(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }
    
    // Add user message to history
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    
    // Get AI response
    const aiResult = await chatWithAI(
      conversation.messages,
      message,
      conversation.productContext
    );
    
    // Add AI response to history
    conversation.messages.push({
      role: 'assistant',
      content: aiResult.response,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      success: true,
      message: aiResult.response,
      conversationId
    });
    
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      error: 'Failed to process message',
      message: error.message
    });
  }
});

// Get conversation history
router.get('/:conversationId', (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = conversations.get(conversationId);
    
    if (!conversation) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }
    
    res.json({
      success: true,
      conversation
    });
    
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({
      error: 'Failed to get conversation',
      message: error.message
    });
  }
});

export default router;
