import { validationResult } from 'express-validator';
import Blog from '../models/blogSchema.js';

// GET all blogs
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve blogs' });
  }
};

// GET a blog by ID
export const getBlogById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve blog' });
  }
};

// POST create a new blog
export const createBlog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, image } = req.body;
    const newBlog = new Blog({ title, description, image });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

// PUT update an existing blog
export const updateBlog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, image } = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, description, image },
      { new: true }
    );

    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

// DELETE a blog
export const deleteBlog = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
