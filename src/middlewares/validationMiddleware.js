import { body, param, validationResult } from 'express-validator';
import { NotificationTypes } from '../models/notificationSchema.js';
import createHttpError from 'http-errors';

// Middleware to validate notification creation
export const validateNotificationCreation = [
  // Validate type
  body('type')
    .trim()
    .isString()
    .custom(value => {
      if (!NotificationTypes.includes(value)) {
        throw new Error('Invalid notification type');
      }
      return true;
    })
    .withMessage('Invalid notification type'),
  
  // Validate title
  body('title')
    .trim()
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Title must be between 1 and 100 characters'),
  
  // Validate message
  body('message')
    .trim()
    .isString()
    .isLength({ min: 1, max: 500 })
    .withMessage('Message must be between 1 and 500 characters'),
  
  // Validate time
  body('time')
    .optional()
    .isString()
    .withMessage('Time must be a string'),
  
  // Validate userId (optional)
  body('userId')
    .optional()
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, {
        message: 'Validation Error',
        errors: errors.array()
      }));
    }
    next();
  }
];

// Middleware to validate ID parameter
export const validateIdParam = [
  // Validate ID parameter
  param('id')
    .trim()
    .isInt({ min: 1 })
    .withMessage('Invalid notification ID'),
  
  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createHttpError(400, {
        message: 'Validation Error',
        errors: errors.array()
      }));
    }
    next();
  }
];

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  // Default to 500 internal server error
  const statusCode = err.status || 500;
  const errorResponse = {
    message: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // If it's a validation error, include the specific errors
  if (err.errors) {
    errorResponse.validationErrors = err.errors;
  }

  res.status(statusCode).json(errorResponse);
};

// Logging middleware
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, url, body, query } = req;

  console.log(`[${timestamp}] ${method} ${url}`);
  
  if (Object.keys(query).length > 0) {
    console.log('Query Params:', query);
  }
  
  if (Object.keys(body).length > 0) {
    console.log('Request Body:', body);
  }

  next();
};