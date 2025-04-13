const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Chat = require('../model/chatData');

// Helper function to generate AI response (replace with actual AI integration)
const generateAIResponse = (prompt) => {
  // This should be replaced with your actual AI service integration
  return `AI response to: ${prompt}`;
};

// Validate request body middleware
const validateChatRequest = (req, res, next) => {
  if (!req.body.userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  if (!req.body.prompt) {
    return res.status(400).json({ error: 'prompt is required' });
  }
  next();
};

// Save chat + generate bot response
router.post('/', validateChatRequest, async (req, res) => {
  const { userId, prompt, conversationId } = req.body;
  const timestamp = new Date();

  try {
    // Generate new conversation ID if not provided
    const newConversationId = conversationId || new mongoose.Types.ObjectId().toString();

    // Save user message
    const userMessage = await Chat.create({ 
      userId, 
      conversationId: newConversationId,
      message: prompt, 
      sender: 'user',
      timestamp
    });

    // Generate AI response
    const botReply = generateAIResponse(prompt);

    // Save AI's message
    await Chat.create({ 
      userId, 
      conversationId: newConversationId,
      message: botReply, 
      sender: 'ai',
      timestamp: new Date()
    });

    res.json({ 
      reply: botReply,
      conversationId: newConversationId,
      timestamp
    });
  } catch (error) {
    console.error('Error saving chat:', error);
    res.status(500).json({ 
      error: 'Failed to process chat',
      details: error.message 
    });
  }
});

// Fetch all conversations for a user (summary only)
router.get('/:userId/conversations', async (req, res) => {
  try {
    const conversations = await Chat.aggregate([
      { $match: { userId: req.params.userId } },
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$conversationId",
          firstMessage: { $first: "$message" },
          lastMessageTime: { $max: "$timestamp" },
          messageCount: { $sum: 1 }
        }
      },
      { $project: { 
        conversationId: "$_id",
        preview: "$firstMessage",
        lastMessageTime: 1,
        messageCount: 1,
        _id: 0
      }},
      { $sort: { lastMessageTime: -1 } }
    ]);

    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch conversations',
      details: error.message 
    });
  }
});

// Fetch specific conversation with pagination
router.get('/:userId/:conversationId', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const messages = await Chat.find({ 
      userId: req.params.userId,
      conversationId: req.params.conversationId 
    })
    .sort({ timestamp: 1 })
    .skip(skip)
    .limit(parseInt(limit));

    const totalMessages = await Chat.countDocuments({
      userId: req.params.userId,
      conversationId: req.params.conversationId
    });

    res.json({
      messages,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalMessages,
        pages: Math.ceil(totalMessages / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ 
      error: 'Failed to fetch conversation',
      details: error.message 
    });
  }
});

// Delete a conversation
router.delete('/:userId/:conversationId', async (req, res) => {
  try {
    const result = await Chat.deleteMany({
      userId: req.params.userId,
      conversationId: req.params.conversationId
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.json({ 
      success: true,
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ 
      error: 'Failed to delete conversation',
      details: error.message 
    });
  }
});

module.exports = router;