import mongoose from 'mongoose';

// Enum for notification types to ensure consistency
const NotificationTypes = [
  'login', 
  'logout', 
  'plan-purchase', 
  'plan-expiry-warning', 
  'plan-expired'
];

// Notification Schema
const NotificationSchema = new mongoose.Schema({
  // Unique identifier for the notification
  id: {
    type: Number,
    required: true,
    unique: true
  },
  
  // Type of notification (constrained to predefined types)
  type: {
    type: String,
    enum: NotificationTypes,
    required: true
  },
  
  // Title of the notification
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  
  // Detailed message of the notification
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  
  // Timestamp of when the notification was created
  time: {
    type: String,
    required: true
  },
  
  // Optional: User ID to associate the notification with a specific user
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  
  // Metadata for tracking notification state
  metadata: {
    // Flag to indicate if the notification has been read
    isRead: {
      type: Boolean,
      default: false
    },
    
    // Timestamp of when the notification was read
    readAt: {
      type: Date,
      default: null
    }
  }
}, {
  // Enable timestamps for createdAt and updatedAt
  timestamps: true
});

// Create a text index for searchability
NotificationSchema.index({ title: 'text', message: 'text' });

// Pre-save middleware to validate and potentially transform data
NotificationSchema.pre('save', function(next) {
  // Ensure type is lowercase and matches predefined types
  this.type = this.type.toLowerCase();
  
  // Validate type
  if (!NotificationTypes.includes(this.type)) {
    return next(new Error('Invalid notification type'));
  }
  
  next();
});

// Method to mark notification as read
NotificationSchema.methods.markAsRead = function() {
  this.metadata.isRead = true;
  this.metadata.readAt = new Date();
  return this.save();
};

// Static method to clear all notifications
NotificationSchema.statics.clearAll = function(userId) {
  return this.deleteMany({ userId: userId });
};

// Compile the model
const Notification = mongoose.model('Notification', NotificationSchema);

export { Notification, NotificationTypes };