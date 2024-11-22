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

export const getTopTenCategories = async (req, res) => {
  try {
    const topCategories = await Blog.aggregate([
      // Group by category and count occurrences
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      // Sort by count in descending order
      {
        $sort: { count: -1 },
      },
      // Limit to top 10 categories
      {
        $limit: 10,
      },
    ]);

    res.json(topCategories); // Send the top categories as response
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve top categories" });
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
    console.log(req.body)
    const { title, jsxcode, author ,category} = req.body;
    const newBlog = new Blog({ title, author, jsxcode,category });
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
    const { title, jsxcode, author ,category} = req.body;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, jsxcode, author,category },
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
