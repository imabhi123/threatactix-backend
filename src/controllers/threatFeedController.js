import ThreatFeed from '../models/threatFeedSchema.js';

// Create a new ThreatFeed
export const createThreatFeed = async (req, res) => {
  try {
    const { name, description, url } = req.body;

    // Validate required fields
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required.' });
    }

    // Create and save new threat feed
    const threatFeed = new ThreatFeed({ name, description, url });
    await threatFeed.save();

    res.status(201).json(threatFeed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create threat feed.' });
  }
};

// Get all ThreatFeeds
export const getAllThreatFeeds = async (req, res) => {
  try {
    const threatFeeds = await ThreatFeed.find();
    res.status(200).json(threatFeeds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch threat feeds.' });
  }
};

// Get a single ThreatFeed by ID
export const getThreatFeedById = async (req, res) => {
  try {
    const { id } = req.params;
    const threatFeed = await ThreatFeed.findById(id);

    if (!threatFeed) {
      return res.status(404).json({ error: 'Threat feed not found.' });
    }

    res.status(200).json(threatFeed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch threat feed.' });
  }
};

// Update a ThreatFeed by ID
export const updateThreatFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, url } = req.body;

    // Validate required fields
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required.' });
    }

    const threatFeed = await ThreatFeed.findByIdAndUpdate(
      id,
      { name, description, url },
      { new: true, runValidators: true }
    );

    if (!threatFeed) {
      return res.status(404).json({ error: 'Threat feed not found.' });
    }

    res.status(200).json(threatFeed);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update threat feed.' });
  }
};

// Delete a ThreatFeed by ID
export const deleteThreatFeed = async (req, res) => {
  try {
    const { id } = req.params;
    const threatFeed = await ThreatFeed.findByIdAndDelete(id);

    if (!threatFeed) {
      return res.status(404).json({ error: 'Threat feed not found.' });
    }

    res.status(200).json({ message: 'Threat feed deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete threat feed.' });
  }
};
