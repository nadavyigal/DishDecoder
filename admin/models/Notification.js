import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['announcement', 'new_feature', 'event', 'challenge', 'promotion', 'system'],
    required: true
  },
  targetUsers: {
    type: String,
    enum: ['all', 'specific', 'role', 'dietary'],
    default: 'all'
  },
  userIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  userRole: {
    type: String,
    enum: ['user', 'admin', 'superadmin']
  },
  dietaryPreference: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'sent', 'cancelled'],
    default: 'draft'
  },
  scheduledFor: {
    type: Date
  },
  sentAt: {
    type: Date
  },
  link: {
    type: String
  },
  imageUrl: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// For scheduled notifications
NotificationSchema.index({ status: 1, scheduledFor: 1 });

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

export default Notification; 