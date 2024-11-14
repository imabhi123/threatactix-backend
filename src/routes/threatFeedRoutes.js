import express from 'express';
import {
  createThreatFeed,
  getAllThreatFeeds,
  getThreatFeedById,
  updateThreatFeed,
  deleteThreatFeed,
} from '../controllers/threatFeedController.js';

const router = express.Router();

// POST /api/threatfeeds - Create a new ThreatFeed
router.post('/threatfeeds', createThreatFeed);

// GET /api/threatfeeds - Get all ThreatFeeds
router.get('/threatfeeds', getAllThreatFeeds);

// GET /api/threatfeeds/:id - Get a single ThreatFeed by ID
router.get('/threatfeeds/:id', getThreatFeedById);

// PUT /api/threatfeeds/:id - Update a ThreatFeed by ID
router.put('/threatfeeds/:id', updateThreatFeed);

// DELETE /api/threatfeeds/:id - Delete a ThreatFeed by ID
router.delete('/threatfeeds/:id', deleteThreatFeed);

export default router;
