import express from 'express';
import { body } from 'express-validator';
import {
  createPlan,
  getAllPlans,
  getPlanById,
  updatePlan,
  deletePlan
} from '../controllers/plansController.js';

const router = express.Router();

// Route to create a new plan with input validation
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('features').isArray().withMessage('Features must be an array'),
    body('discount').optional().isNumeric().withMessage('Discount must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ],
  createPlan
);

// Route to get all plans
router.get('/', getAllPlans);

// Route to get a single plan by ID
router.get('/:id', getPlanById);

// Route to update a plan by ID with input validation
router.put(
  '/:id',
  [
    body('name').optional().notEmpty().withMessage('Name is required'),
    body('description').optional().notEmpty().withMessage('Description is required'),
    body('price').optional().isNumeric().withMessage('Price must be a number'),
    body('duration').optional().isNumeric().withMessage('Duration must be a number'),
    body('features').optional().isArray().withMessage('Features must be an array'),
    body('discount').optional().isNumeric().withMessage('Discount must be a number'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  ],
  updatePlan
);

// Route to delete a plan by ID
router.delete('/:id', deletePlan); 

export default router;
