import mongoose from 'mongoose';

const UserNotificationSchema = new mongoose.Schema({
  notification: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isClicked: {
    type: Boolean,
    default: false
  },
  deliveredAt: {
    type: Date,
    default: Date.now
  },
  readAt: {
    type: Date
  },
  clickedAt: {
    type: Date
  },
  deviceInfo: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for faster querying
UserNotificationSchema.index({ user: 1, isRead: 1 });
UserNotificationSchema.index({ notification: 1 });
UserNotificationSchema.index({ deliveredAt: -1 });

const UserNotification = mongoose.models.UserNotification || mongoose.model('UserNotification', UserNotificationSchema);

export default UserNotification; 