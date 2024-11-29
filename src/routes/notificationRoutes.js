import express from 'express';
import {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    clearAllNotifications,
    getNotificationTypes
} from '../controllers/notificationControllers.js';
import {
    validateNotificationCreation,
    validateIdParam
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Get all notification types (public route)
router.get('/types', getNotificationTypes);

// Create a new notification (admin/system route)
router.post('/',
    validateNotificationCreation,
    createNotification
);

// Get user's notifications (protected route)
router.post('/me',

    getUserNotifications
);

// Mark a specific notification as read
router.patch('/:id/read',

    validateIdParam,
    markNotificationAsRead
);

// Clear all notifications for the user
router.delete('/clear',

    clearAllNotifications
);

export default router;