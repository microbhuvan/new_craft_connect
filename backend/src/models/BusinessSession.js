const mongoose = require('mongoose');

const BusinessSessionSchema = new mongoose.Schema({
  // Step 1: Business Overview
  transcript: {
    type: String,
    required: true
  },
  businessSummary: {
    businessType: String,
    businessName: String,
    experience: String,
    location: String,
    mainChallenges: [String],
    currentStatus: String,
    goals: [String],
    hasOnlinePresence: Boolean,
    targetMarket: String,
    keyStrengths: [String]
  },
  businessSummaryApproved: {
    type: Boolean,
    default: false
  },
  
  // Step 2: Product Analysis
  productTranscript: {
    type: String
  },
  imageAnalyses: [{
    imageIndex: Number,
    labels: [{
      description: String,
      score: Number
    }],
    objects: [{
      name: String,
      score: Number
    }],
    text: String,
    colors: [{
      red: Number,
      green: Number,
      blue: Number,
      score: Number
    }],
    error: String,
    details: String
  }],
  productAnalysis: {
    productSummary: {
      name: String,
      category: String,
      materials: [String],
      techniques: [String],
      uniqueFeatures: [String],
      qualityLevel: String,
      timeToMake: String,
      difficulty: String
    },
    visualAnalysis: {
      overallAppearance: String,
      colorScheme: [String],
      craftsmanship: String,
      marketAppeal: String,
      photographyQuality: String,
      improvementSuggestions: [String]
    },
    marketingInsights: {
      targetAudience: String,
      pricingRange: String,
      sellingPoints: [String],
      competitiveAdvantage: String,
      seasonality: String
    },
    digitalMarketingStrategy: {
      instagramHashtags: [String],
      keywordFocus: [String],
      contentAngles: [String],
      platformSuitability: {
        instagram: String,
        facebook: String,
        whatsapp: String,
        website: String
      }
    },
    recommendations: {
      immediate: [String],
      shortTerm: [String],
      longTerm: [String]
    }
  },
  productApproved: {
    type: Boolean,
    default: false
  },
  productFeedback: String,
  
  // Step 3: Final Recommendations
  finalRecommendations: {
    primaryRecommendations: [{
      platform: String,
      priority: Number,
      reason: String,
      implementation: String,
      expectedOutcome: String
    }],
    contentStrategy: {
      focusAreas: [String],
      contentTypes: [String],
      postingFrequency: String
    },
    marketingMessages: {
      whatsapp: String,
      instagram: String,
      general: String
    },
    nextSteps: [String]
  },
  
  // Flow Management
  step: {
    type: String,
    enum: [
      'business_overview_complete',
      'ready_for_product_analysis', 
      'product_analysis_complete',
      'ready_for_recommendations',
      'complete',
      'product_needs_revision'
    ],
    default: 'business_overview_complete'
  },
  
  // Session Management
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 86400 // 24 hours in seconds
  },
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // Optional user identification
  userIdentifier: String, // Could be email, phone, or anonymous ID
  
  // Analytics
  completionRate: {
    type: Number,
    default: 0 // Percentage of flow completed
  },
  timeSpent: {
    type: Number,
    default: 0 // Time in seconds
  }
});

// Indexes for performance
BusinessSessionSchema.index({ createdAt: 1 });
BusinessSessionSchema.index({ step: 1 });
BusinessSessionSchema.index({ isActive: 1 });
BusinessSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for completion percentage calculation
BusinessSessionSchema.virtual('completionPercentage').get(function() {
  const stepWeights = {
    'business_overview_complete': 25,
    'ready_for_product_analysis': 35,
    'product_analysis_complete': 70,
    'ready_for_recommendations': 85,
    'complete': 100,
    'product_needs_revision': 60
  };
  return stepWeights[this.step] || 0;
});

// Pre-save middleware to update timestamps and completion rate
BusinessSessionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Update completion rate
  const stepWeights = {
    'business_overview_complete': 25,
    'ready_for_product_analysis': 35,
    'product_analysis_complete': 70,
    'ready_for_recommendations': 85,
    'complete': 100,
    'product_needs_revision': 60
  };
  this.completionRate = stepWeights[this.step] || 0;
  
  next();
});

// Instance methods
BusinessSessionSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

BusinessSessionSchema.methods.extendSession = function(hours = 24) {
  this.expiresAt = new Date(Date.now() + (hours * 60 * 60 * 1000));
  return this.save();
};

BusinessSessionSchema.methods.getNextStep = function() {
  const stepFlow = {
    'business_overview_complete': 'ready_for_product_analysis',
    'ready_for_product_analysis': 'product_analysis_complete',
    'product_analysis_complete': 'ready_for_recommendations',
    'ready_for_recommendations': 'complete',
    'product_needs_revision': 'product_analysis_complete'
  };
  return stepFlow[this.step] || 'complete';
};

BusinessSessionSchema.methods.canProceedToStep = function(targetStep) {
  const stepOrder = [
    'business_overview_complete',
    'ready_for_product_analysis',
    'product_analysis_complete', 
    'ready_for_recommendations',
    'complete'
  ];
  
  const currentIndex = stepOrder.indexOf(this.step);
  const targetIndex = stepOrder.indexOf(targetStep);
  
  return targetIndex <= currentIndex + 1;
};

// Static methods
BusinessSessionSchema.statics.findActiveSessions = function() {
  return this.find({ 
    isActive: true, 
    expiresAt: { $gt: new Date() } 
  });
};

BusinessSessionSchema.statics.getSessionStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$step',
        count: { $sum: 1 },
        avgCompletionRate: { $avg: '$completionRate' }
      }
    },
    {
      $sort: { '_id': 1 }
    }
  ]);
};

module.exports = mongoose.model('BusinessSession', BusinessSessionSchema);