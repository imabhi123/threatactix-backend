import express from 'express';
import { body, param } from 'express-validator';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blogControllers.js';

const router = express.Router();

// Route to get all blogs
router.get('/', getAllBlogs);

// Route to get a blog by ID with validation
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid blog ID')],
  getBlogById
);

// Route to create a new blog with validations
router.post(
  '/',
  [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('description').notEmpty().withMessage('Description is required'),
    body('image').isURL().withMessage('Image must be a valid URL'),
  ],
  createBlog
);

// Route to update a blog by ID with validations
router.put(
  '/:id',
  [
    param('id').isMongoId().withMessage('Invalid blog ID'),
    body('title')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Title cannot exceed 100 characters'),
    body('description').optional(),
    body('image').optional().isURL().withMessage('Image must be a valid URL'),
  ],
  updateBlog
);

// Route to delete a blog by ID with validation
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid blog ID')],
  deleteBlog
);

export default router;
