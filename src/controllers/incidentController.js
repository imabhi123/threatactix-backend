// Import the Incident model
import Incident from '../models/IncidentSchema.js';

// Utility function to handle server errors
const handleServerError = (res, error, message) => {
  res.status(500).json({ message, error });
};

// Create a new Incident
export const createIncident = async (req, res) => {
  try {
    // Destructure the necessary fields from the request body
    const {
      title,
      url,
      threatActor,
      rawContent,
      publicationDate,
      plannedPublicationDate,
      category,
      network,
      victims,
      images,
    } = req.body;

    // Validate that required fields are provided
    if (!title || !url || !threatActor || !rawContent || !publicationDate || !category || !network || !victims) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create a new Incident instance
    const newIncident = new Incident({
      title,
      url,
      threatActor,
      rawContent,
      publicationDate,
      plannedPublicationDate, // Optional
      category,
      network,
      victims,
      images, // Optional
    });

    // Save the incident to the database
    await newIncident.save();

    // Return success response
    return res.status(201).json({ message: 'Incident created successfully', incident: newIncident });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error creating incident:', error);
    return res.status(500).json({ message: 'Server error, could not create incident' });
  }
};

// Get all Incidents
export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.find();
    res.status(200).json({success:true,data:incidents});
  } catch (error) {
    handleServerError(res, error, 'Error retrieving incidents');
  }
};

// Get a single Incident by ID
export const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    console.log(incident)
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.status(200).json(incident);
  } catch (error) {
    handleServerError(res, error, 'Error retrieving incident');
  }
};

// Update an existing Incident
export const updateIncident = async (req, res) => {
  try {
    const updatedIncident = await Incident.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.status(200).json(updatedIncident);
  } catch (error) {
    handleServerError(res, error, 'Error updating incident');
  }
};

// Delete an Incident by ID
export const deleteIncident = async (req, res) => {
  try {
    const deletedIncident = await Incident.findByIdAndDelete(req.params.id);
    if (!deletedIncident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    res.status(200).json({ message: 'Incident deleted successfully' });
  } catch (error) {
    handleServerError(res, error, 'Error deleting incident');
  }
};

// Search Incidents by category or network
export const searchIncidents = async (req, res) => {
  try {
    const {
      category,
      network,
      threatActorName,
      startDate,
      endDate,
      sortBy = 'publicationDate', // default sort by publicationDate
      order = 'desc', // default sort order
      limit = 10, // default pagination limit
      page = 1, // default page
      fields, // optional field selection
    } = req.query;

    const searchCriteria = {};

    // Add search criteria dynamically
    if (category) {
      searchCriteria.category = new RegExp(category, 'i'); // Case-insensitive partial match
    }
    if (network) {
      searchCriteria.network = new RegExp(network, 'i');
    }
    if (threatActorName) {
      searchCriteria['threatActor.name'] = new RegExp(threatActorName, 'i');
    }

    // Date range filtering (optional)
    if (startDate || endDate) {
      searchCriteria.publicationDate = {};
      if (startDate) {
        searchCriteria.publicationDate.$gte = new Date(startDate);
      }
      if (endDate) {
        searchCriteria.publicationDate.$lte = new Date(endDate);
      }
    }

    // Pagination and sorting setup
    const skip = (page - 1) * limit; // Calculate the skip value for pagination
    const sortOrder = order === 'asc' ? 1 : -1;

    // Fetch incidents with pagination, sorting, and optional field selection
    const incidents = await Incident.find(searchCriteria)
      .select(fields ? fields.split(',').join(' ') : '') // Select specific fields if provided
      .sort({ [sortBy]: sortOrder }) // Sorting by the field (default: publicationDate)
      .skip(skip) // Pagination skip
      .limit(parseInt(limit)); // Pagination limit

    // Count total number of incidents matching the search criteria (for pagination meta)
    const totalIncidents = await Incident.countDocuments(searchCriteria);

    // Return the results along with pagination information
    res.status(200).json({
      total: totalIncidents,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalIncidents / limit),
      incidents,
    });
  } catch (error) {
    console.error('Error searching incidents:', error);
    res.status(500).json({ message: 'Error searching incidents' });
  }
};

// Get incidents by a date range
export const getIncidentsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const incidents = await Incident.find({
      publicationDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });

    res.status(200).json(incidents);
  } catch (error) {
    handleServerError(res, error, 'Error retrieving incidents by date range');
  }
};

// Add an image to an existing Incident
export const addImageToIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, url } = req.body;

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    incident.images.push({ description, url });
    await incident.save();

    res.status(200).json(incident);
  } catch (error) {
    handleServerError(res, error, 'Error adding image to incident');
  }
};

// Remove an image from an Incident
export const removeImageFromIncident = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }

    incident.images = incident.images.filter(img => img._id.toString() !== imageId);
    await incident.save();

    res.status(200).json(incident);
  } catch (error) {
    handleServerError(res, error, 'Error removing image from incident');
  }
};

export const getImageByRecentDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Ensure that both startDate and endDate are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Please provide both startDate and endDate" });
    }

    // Query incidents based on the date range
    const incidents = await Incident.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    // If no incidents found, return a not found response
    if (incidents.length === 0) {
      return res.status(404).json({ message: "No incidents found in the given date range" });
    }

    // Respond with the incidents found
    return res.status(200).json(incidents);

  } catch (error) {
    // Handle any errors that occur during the query or request
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};
export const recentMalwares = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Ensure that both startDate and endDate are provided
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Please provide both startDate and endDate" });
    }

    // Query incidents based on the date range
    const incidents = await Incident.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) }
    });

    // If no incidents found, return a not found response
    if (incidents.length === 0) {
      return res.status(404).json({ message: "No incidents found in the given date range" });
    }

    // Respond with the incidents found
    return res.status(200).json(incidents);

  } catch (error) {
    // Handle any errors that occur during the query or request
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const getMostAffectedCountries = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const allcountries=await Incident.find({});
    console.log(allcountries[0].victims)

    const countries = await Incident.aggregate([
      {
        $match: {
          publicationDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      { $unwind: "$victims" }, // Unwind the array of victims
      {
        $group: {
          _id: "$victims.country", // Group by country
          count: { $sum: 1 }       // Count the occurrences
        }
      },
      { $sort: { count: -1 } }    // Sort by count in descending order
    ]);
    console.log(countries,'abhishek')

    return res.status(200).json(countries);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const getMostActiveThreatActors = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const threatActors = await Incident.aggregate([
      {
        $match: {
          publicationDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      {
        $group: {
          _id: "$threatActor.name", // Group by threat actor name
          count: { $sum: 1 }        // Count the occurrences
        }
      },
      { $sort: { count: -1 } }      // Sort by count in descending order
    ]);

    return res.status(200).json(threatActors);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

export const getMostTargetedIndustries = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const industries = await Incident.aggregate([
      {
        $match: {
          publicationDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
        }
      },
      { $unwind: "$victims" }, // Unwind the array of victims
      {
        $group: {
          _id: "$victims.industry", // Group by industry
          count: { $sum: 1 }        // Count the occurrences
        }
      },
      { $sort: { count: -1 } }      // Sort by count in descending order
    ]);

    return res.status(200).json(industries);
  } catch (error) {
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};

// Export all controllers as a single module
export default {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  searchIncidents,
  getIncidentsByDateRange,
  addImageToIncident,
  removeImageFromIncident,
  getMostActiveThreatActors,
  getMostAffectedCountries,
  getMostTargetedIndustries
};
