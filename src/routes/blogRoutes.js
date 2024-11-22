import express from 'express';
import { body, param } from 'express-validator';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getTopTenCategories,
} from '../controllers/blogControllers.js';

const router = express.Router();

// Route to get all blogs
router.get('/', getAllBlogs);
router.get('/get-top-ten-categories',getTopTenCategories);

// Route to get a blog by ID with validation
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid blog ID')],
  getBlogById
);

// Route to create a new blog with validations
router.post(
  '/',
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
