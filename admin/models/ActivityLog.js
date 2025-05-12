import mongoose from 'mongoose';

const ActivityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login', 
      'logout', 
      'recipe_view', 
      'recipe_create', 
      'recipe_edit', 
      'recipe_delete',
      'like',
      'favorite',
      'search',
      'upload',
      'adapt_recipe'
    ]
  },
  resourceType: {
    type: String,
    enum: ['recipe', 'user', 'notification', 'system', 'challenge']
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for faster queries on user actions
ActivityLogSchema.index({ user: 1, action: 1 });
ActivityLogSchema.index({ timestamp: -1 });

const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);

export default ActivityLog; 