import { Notification, NotificationTypes } from '../models/notificationSchema.js';
import createHttpError from 'http-errors';

// Create a new notification
export const createNotification = async (req, res, next) => {
  try {
    const {
      type,
      title,
      message,
      time,
      userId
    } = req.body;

    // Validate notification type
    if (!NotificationTypes.includes(type)) {
      return next(createHttpError(400, 'Invalid notification type'));
    }

    // Generate unique ID (in a real app, you might use a more robust ID generation)
    const lastNotification = await Notification.findOne().sort({ id: -1 });
    const newId = lastNotification ? lastNotification.id + 1 : 1;

    // Create new notification
    const notification = new Notification({
      id: newId,
      type,
      title,
      message,
      time,
      userId: userId || null
    });

    await notification.save();

    res.status(201).json({
      message: 'Notification created successfully',
      notification
    });
  } catch (error) {
    next(createHttpError(500, 'Error creating notification'));
  }
};

export const getUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.body; // Assuming `userId` is passed in the request body

    // Validate userId
    if (!userId) {
      return next(createHttpError(400, 'User ID is required'));
    }

    // Fetch notifications for the specific user
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

    // Return the notifications
    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    next(createHttpError(500, 'Error fetching notifications'));
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId } = req.body; // Assuming authenticated user

    const notification = await Notification.findOne({
      id: parseInt(id),
      userId
    });

    if (!notification) {
      return next(createHttpError(404, 'Notification not found'));
    }

    notification.metadata.isRead = true;
    notification.metadata.readAt = new Date();

    await notification.save();

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    next(createHttpError(500, 'Error marking notification as read'));
  }
};

// Clear all notifications for a user
export const clearAllNotifications = async (req, res, next) => {
  try {
    const { userId } = req.body; // Assuming authenticated user

    const result = await Notification.deleteMany({ userId });

    res.json({
      message: 'All notifications cleared',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    next(createHttpError(500, 'Error clearing notifications'));
  }
};

// Get notification types
export const getNotificationTypes = (req, res) => {
  res.json({
    notificationTypes: NotificationTypes
  });
};