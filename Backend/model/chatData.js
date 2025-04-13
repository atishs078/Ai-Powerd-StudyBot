const mongoose = require('mongoose');

const chatDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  conversationId: {
    type: String,
    required: true,
    default: () => mongoose.Types.ObjectId().toString()
  },
  message: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
chatDataSchema.index({ userId: 1 });
chatDataSchema.index({ conversationId: 1 });
chatDataSchema.index({ timestamp: 1 });

module.exports = mongoose.model('ChatData', chatDataSchema);