import { body } from 'express-validator';

export const validatePlan = [
  body('name').isString().notEmpty().withMessage('Name is required and should be a string'),
  body('description').isString().notEmpty().withMessage('Description is required and should be a string'),
  body('price').isFloat({ min: 0 }).withMessage('Price should be a non-negative number'),
  body('duration')
    .isIn(['monthly', 'quarterly', 'yearly'])
    .withMessage('Duration must be either "monthly", "quarterly", or "yearly"'),
  body('features')
    .isArray({ min: 1 })
    .withMessage('Features should be an array with at least one feature'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount should be a number between 0 and 100'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive should be a boolean value')
];
