const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow guest users
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },

  // Current workflow step
  currentStep: {
    type: String,
    enum: ['voice_recording', 'image_upload', 'ai_processing', 'review', 'channels'],
    default: 'voice_recording'
  },

  // Temporary data during workflow
  tempData: {
    transcript: String,
    analysis: mongoose.Schema.Types.Mixed, // Business analysis from voice
    originalImageUrl: String,
    visionResults: mongoose.Schema.Types.Mixed,
    currentProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  },

  // Auto-expire sessions after 24 hours
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours in seconds
  }
}, {
  timestamps: true
});

// Indexes
SessionSchema.index({ userId: 1 });
SessionSchema.index({ sessionId: 1 });
SessionSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('Session', SessionSchema);