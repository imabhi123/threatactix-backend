// Import the Incident model
import Incident from "../models/IncidentSchema.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { parseFile } from "../utils/parseFile.js";
import { transformIncidentData } from "../utils/utilityfunc.js";
import { Admin } from "../models/adminModel.js";
import Malware from "../models/malwareSchema.js";
import Victim from "../models/victimSchema.js";
import { User } from "../models/userModel.js";

// Manually define __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to handle server errors
const handleServerError = (res, error, message) => {
  res.status(500).json({ message, error });
};



// export const createFuncUtil = async (data,arr) => {
//   try {
//     // Destructure the necessary fields from the request body
//     const {
//       title,
//       url,
//       threatActor,
//       rawContent,
//       publicationDate,
//       plannedPublicationDate,
//       category,
//       network,
//       victims,
//       images,
//     } = data;

//     // Validate that required fields are provided
//     if (!title || !url || !threatActor || !rawContent || !publicationDate || !category || !network || !victims) {
//       arr.push('error');
//       return;
//       // return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Create a new Incident instance
//     const newIncident = new Incident({
//       title,
//       url,
//       threatActor,
//       rawContent,
//       publicationDate,
//       plannedPublicationDate, // Optional
//       category,
//       network,
//       victims,
//       images, // Optional
//     });

//     // Save the incident to the database
//     await newIncident.save();
//     arr.push('success')

//     // Return success response
//     // return res.status(201).json({ message: 'Incident created successfully', incident: newIncident });
//   } catch (error) {
//     // Handle any errors that occur during the process
//     console.error('Error creating incident:', error);
//     return res.status(500).json({ message: 'Server error, could not create incident' });
//   }
// };

// Create a new Incident

export const createFuncUtil = async (data, userId, headingsArray) => {
  try {
    const newExcelData = new Incident({
      sheetName: "Incident Data",
      data: [data],
      creator: userId,
      headings: headingsArray,
    });

    await newExcelData.save();
  } catch (error) {
    console.error("Error saving data:", error);
  }
};

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
    if (
      !title ||
      !url ||
      !threatActor ||
      !rawContent ||
      !publicationDate ||
      !category ||
      !network ||
      !victims
    ) {
      return res.status(400).json({ message: "Missing required fields" });
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
    return res.status(201).json({
      message: "Incident created successfully",
      incident: newIncident,
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error creating incident:", error);
    return res
      .status(500)
      .json({ message: "Server error, could not create incident" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the incident by its ID
    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // Toggle the status
    incident.status = !incident.status;

    // Save the updated incident
    await incident.save();

    return res.status(200).json({
      message: "Incident status updated successfully",
      incident,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating status", error });
  }
};

export const deleteIncident = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the incident by ID and delete it
    const incident = await Incident.findByIdAndDelete(id);

    // Check if the incident exists
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // Send a success response
    res.status(200).json({ message: "Incident deleted successfully" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Error deleting incident", error });
  }
};

// export const createIncidentByUploadingFile= async (req, res) => {
//   try {
//     const file = req.file;
//     console.log(file)
//     if (!file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     const ext = path.extname(file.originalname).toLowerCase();
//     const validExtensions = ['.xlsx', '.xls', '.csv'];
//     if (!validExtensions.includes(ext)) {
//       return res.status(400).send('Invalid file type. Upload only Excel or CSV files.');
//     }

//     const filePath = path.join(__dirname, '../..','uploads', file.filename);

//     // Parse the file based on its type
//     const extractedData = await parseFile(filePath, ext);
//     for(let i=0;i<extractedData?.length;i++){
//       extractedData[i]=transformIncidentData(extractedData[i]);
//     }

//     const arr=[];
//     for(let i=0;i<extractedData.length;i++){
//       await createFuncUtil(extractedData[i],arr);
//     }

//     res.status(200).json({
//       message: 'File processed successfully!',
//       data: {extractedData,arr},
//     });

//     // Clean up the file after processing
//     fs.unlinkSync(filePath);

//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error processing file.');
//   }
// }

// Get all Incidents

// export const createIncidentByUploadingFile = async (req, res) => {
//   try {
//     const file = req.file;
//     const { userId } = req.body;
//     // console.log("abhishek", userId,req.body);
//     if (!file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     const ext = path.extname(file.originalname).toLowerCase();
//     const validExtensions = [".xlsx", ".xls", ".csv"];
//     if (!validExtensions.includes(ext)) {
//       return res
//         .status(400)
//         .send("Invalid file type. Upload only Excel or CSV files.");
//     }

//     const filePath = path.join(__dirname, "../..", "uploads", file.filename);

//     // Parse the file based on its type
//     const extractedData = await parseFile(filePath, ext);

//     const transformedData = extractedData.map(transformIncidentData);

//     const headingsArray = [];
//     // Save each row as a document in the database
//     await Promise.all(
//       transformedData.map(async (rowData, index) => {
//         if (index === 0) {
//           rowData?.row.forEach((value, key) => {
//             headingsArray.push(convertToNaturalLanguage(key));
//           });
//           const admin = await Admin.findByIdAndUpdate(
//             userId, // use userId as the document's _id
//             { tableHeadings: headingsArray }, // update tableHeadings
//             { new: true } // return the updated document
//           );
//         }
//         await createFuncUtil(rowData, userId);
//       })
//     );

//     res.status(200).json({
//       message: "File processed successfully!",
//       data: transformedData,
//     });

//     // Clean up the file after processing
//     fs.unlinkSync(filePath);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error processing file.");
//   }
// };

export const createIncidentByUploadingFile = async (req, res) => {
  try {
    const file = req.file;
    const { userId } = req.body;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const validExtensions = [".xlsx", ".xls", ".csv"];
    if (!validExtensions.includes(ext)) {
      return res
        .status(400)
        .send("Invalid file type. Upload only Excel or CSV files.");
    }

    const filePath = path.join(__dirname, "../..", "uploads", file.filename);

    // Parse the file based on its type
    const extractedData = await parseFile(filePath, ext);

    const transformedData = extractedData.map(transformIncidentData);

    const headingsArray = [];
    await Promise.all(
      transformedData.map(async (rowData, index) => {
        if (index === 0) {
          rowData?.row.forEach((value, key) => {
            headingsArray.push(key);
          });

          // Update the heading only if tableHeadings is empty
          const admin = await Admin.findOneAndUpdate(
            { _id: userId, tableHeadings: { $exists: true, $size: 0 } },
            { tableHeadings: headingsArray },
            { new: true }
          );
        }
        await createFuncUtil(rowData, userId);
      })
    );

    res.status(200).json({
      message: "File processed successfully!",
      data: transformedData,
    });

    // Clean up the file after processing
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error processing file.");
  }
};


export const updateRowData = async (req, res) => {
  try {
    const { userId, incidentId, rowData } = req.body;
    console.log(req.body);

    // Check if the incident exists
    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // Update the single row data
    const updatedIncident = await Incident.findByIdAndUpdate(
      incidentId,
      { "data.0.row": rowData }, // Access the first element in the data array
      { new: true } // Return the updated document
    );

    if (!updatedIncident) {
      return res.status(404).json({ message: "Failed to update row data" });
    }

    res
      .status(200)
      .json({ message: "Row data updated successfully", updatedIncident });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const updateMalwareRowData = async (req, res) => {
  try {
    const { userId, incidentId, rowData } = req.body;

    // Check if the incident exists
    const incident = await Malware.findById(incidentId);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // Update the single row data
    const updatedIncident = await Malware.findByIdAndUpdate(
      incidentId,
      { "data.0.row": rowData }, // Access the first element in the data array
      { new: true } // Return the updated document
    );

    if (!updatedIncident) {
      return res.status(404).json({ message: "Failed to update row data" });
    }

    res
      .status(200)
      .json({ message: "Row data updated successfully", updatedIncident });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const updateVictimRowData = async (req, res) => {
  try {
    const { userId, incidentId, rowData } = req.body;

    // Check if the incident exists
    const incident = await Victim.findById(incidentId);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // Update the single row data
    const updatedIncident = await Victim.findByIdAndUpdate(
      incidentId,
      { "data.0.row": rowData }, // Access the first element in the data array
      { new: true } // Return the updated document
    );

    if (!updatedIncident) {
      return res.status(404).json({ message: "Failed to update row data" });
    }

    res
      .status(200)
      .json({ message: "Row data updated successfully", updatedIncident });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const getAllIncidents = async (req, res) => {
  try {
    // Extract start, end, and category from the query parameters
    const { start = 0, end = 100, category } = req.query; // Default to 0 and 10 if start and end are not provided
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (user) {
      await User.findByIdAndUpdate(
        userId,
        { $inc: { count: 1 } }, // Increment the 'count' field by 1
        { new: true }           // Return the updated document
      );
    }

    // Ensure that start and end are integers
    const startIndex = parseInt(start);
    const endIndex = parseInt(end);
    const newArray = await Incident.find({});
    console.log(newArray.length, 'sdld')

    // Build the query conditionally based on the category
    const query = category ? { category } : {};
    console.log(query);
    // Fetch incidents with pagination and optional category filter
    const totalIncidents = await Incident.find(query).countDocuments();

    const incidents = await Incident.find(query)
      .skip(startIndex) // Skip documents to start pagination
      .limit(endIndex - startIndex); // Limit the number of documents returned

    res.status(200).json({
      success: true,
      data: incidents,
      pagination: {
        start: startIndex,
        end: endIndex,
        count: totalIncidents, // Total number of incidents matching the query
      },
    });
  } catch (error) {
    handleServerError(res, error, "Error retrieving incidents");
  }
};

const getUsersByActivity = async (req, res) => {
  try {
    // Fetch users sorted by count in descending order
    const users = await User.find().sort({ count: -1 });

    // Return the sorted array of users
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users by activity:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getIncidentsById = async (req, res) => {
  try {
    // Extract start, end, category, startDate, and endDate from the query parameters, and userId from the body
    const { start = 0, end = 10, category, startDate, endDate } = req.query;
    const { userId } = req.body;

    // Ensure that start and end are integers
    const startIndex = parseInt(start);
    const endIndex = parseInt(end);

    // Build the query object
    const query = { creator: userId };

    // Add date filtering if startDate and endDate are provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    // Fetch incidents based on the query
    const incidents = await Incident.find(query)
      .skip(startIndex)
      .limit(endIndex - startIndex);

    // Fetch the total count for pagination
    const totalCount = await Incident.countDocuments(query);

    // Respond with data and pagination information
    res.status(200).json({
      success: true,
      data: incidents,
      pagination: {
        start: startIndex,
        end: endIndex,
        count: totalCount,
      },
    });
  } catch (error) {
    handleServerError(res, error, "Error retrieving incidents");
  }
};


export const deleteMultipleIncidents = async (req, res) => {
  try {
    // Extract IDs from the request body
    const { ids } = req.body;
    console.log(ids)

    // Validate that IDs are provided and in the correct format
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of incident IDs to delete.",
      });
    }

    // Perform deletion
    const result = await Incident.deleteMany({ _id: { $in: ids } });

    // Check if any documents were deleted
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No incidents found with the provided IDs.",
      });
    }

    // Success response
    res.status(200).json({
      success: true,
      message: `${result.deletedCount} incidents deleted successfully.`,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting incidents.",
      error: error.message,
    });
  }
};

// Get a single Incident by ID
export const getIncidentById = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    console.log(incident);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }
    res.status(200).json(incident);
  } catch (error) {
    handleServerError(res, error, "Error retrieving incident");
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
      return res.status(404).json({ message: "Incident not found" });
    }
    res.status(200).json(updatedIncident);
  } catch (error) {
    handleServerError(res, error, "Error updating incident");
  }
};

// Search Incidents by category or network
export const searchIncidents = async (req, res) => {
  try {
    // Extract query parameters from the request
    const {
      title,
      status,
      category,
      threatActorName,
      victimCountry,
      victimIndustry,
    } = req.query;

    // Build a dynamic query object based on the provided parameters
    const searchQuery = {};

    if (title) {
      searchQuery.title = { $regex: title, $options: "i" }; // Case-insensitive search
    }

    if (status !== undefined) {
      searchQuery.status = status === "true"; // Convert string to boolean
    }

    if (category) {
      searchQuery.category = { $regex: category, $options: "i" }; // Case-insensitive search
    }

    if (threatActorName) {
      searchQuery["threatActor.name"] = {
        $regex: threatActorName,
        $options: "i",
      }; // Case-insensitive search
    }

    if (victimCountry) {
      searchQuery["victims.country"] = { $regex: victimCountry, $options: "i" }; // Case-insensitive search
    }

    if (victimIndustry) {
      searchQuery["victims.industry"] = {
        $regex: victimIndustry,
        $options: "i",
      }; // Case-insensitive search
    }

    // Perform the search using Mongoose
    const incidents = await Incident.find(searchQuery).sort({ createdAt: -1 }); // Sorting by the newest first

    // Return the search results
    res.status(200).json({
      success: true,
      data: incidents,
    });
  } catch (error) {
    console.error("Error searching incidents:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
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
    handleServerError(res, error, "Error retrieving incidents by date range");
  }
};

// Add an image to an existing Incident
export const addImageToIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, url } = req.body;

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    incident.images.push({ description, url });
    await incident.save();

    res.status(200).json(incident);
  } catch (error) {
    handleServerError(res, error, "Error adding image to incident");
  }
};

// Remove an image from an Incident
export const removeImageFromIncident = async (req, res) => {
  try {
    const { id, imageId } = req.params;

    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    incident.images = incident.images.filter(
      (img) => img._id.toString() !== imageId
    );
    await incident.save();

    res.status(200).json(incident);
  } catch (error) {
    handleServerError(res, error, "Error removing image from incident");
  }
};

export const getImageByRecentDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Ensure that both startDate and endDate are provided
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Please provide both startDate and endDate" });
    }

    // Query incidents based on the date range
    const incidents = await Incident.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    // If no incidents found, return a not found response
    if (incidents.length === 0) {
      return res
        .status(404)
        .json({ message: "No incidents found in the given date range" });
    }

    // Respond with the incidents found
    return res.status(200).json(incidents);
  } catch (error) {
    // Handle any errors that occur during the query or request
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const recentMalwares = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    // Ensure that both startDate and endDate are provided
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Please provide both startDate and endDate" });
    }

    // Query incidents based on the date range
    const incidents = await Incident.find({
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    });

    // If no incidents found, return a not found response
    if (incidents.length === 0) {
      return res
        .status(404)
        .json({ message: "No incidents found in the given date range" });
    }

    // Respond with the incidents found
    return res.status(200).json(incidents);
  } catch (error) {
    // Handle any errors that occur during the query or request
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// export const getMostAffectedCountries = async (req, res) => {
//   try {
//     // Default startDate and endDate values
//     const { startDate = '2023-10-12', endDate = Date.now() } = req.body;

//     // Parse dates correctly
//     const start = new Date(startDate);
//     const end = new Date(endDate);

//     console.log(start,end)

//     // Ensure both dates are valid
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//       return res.status(400).json({ message: "Invalid date format" });
//     }

//     const allData=await Incident.find({});
//     console.log(allData);

//     // Retrieve and aggregate the countries affected within the date range
//     const countries = await Incident.aggregate([
//       {
//         $match: {
//           publicationDate: { $gte: start, $lte: end }
//         }
//       },
//       { $unwind: "$victims" }, // Unwind the array of victims
//       {
//         $group: {
//           _id: "$victims.country", // Group by victim's country
//           count: { $sum: 1 }       // Count the occurrences of each country
//         }
//       },
//       { $sort: { count: -1 } }    // Sort by count in descending order
//     ]);

//     // Log the result for debugging
//     console.log(countries);

//     // Return the result
//     return res.status(200).json(countries);
//   } catch (error) {
//     console.error("Error fetching countries:", error);
//     return res.status(500).json({ message: "An error occurred", error: error.message });
//   }
// };

export const getMostAffectedCountries = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { startDate = "2023-10-12", endDate = Date.now() } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (end < start) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    const countries = await Incident.aggregate([
      { $unwind: "$data" },
      {
        $match: {
          "data.row.victims_country": { $exists: true, $ne: null },
          "data.row.publicationDate": { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$data.row.victims_country",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: 1,
        },
      },
    ]);

    if (countries.length === 0) {
      return res.status(404).json({
        message: "No affected countries found in the specified date range",
      });
    }

    console.log(countries);

    return res.status(200).json(countries);
  } catch (error) {
    console.error("Error retrieving affected countries:", error);
    return res.status(500).json({
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};

export const getMostActiveThreatActors = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const threatActors = await Incident.aggregate([
      {
        $match: {
          publicationDate: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: "$threatActor.name", // Group by threat actor name
          count: { $sum: 1 }, // Count the occurrences
        },
      },
      { $sort: { count: -1 } }, // Sort by count in descending order
    ]);

    return res.status(200).json(threatActors);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// export const getMostTargetedIndustries = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.body;

//     const industries = await Incident.aggregate([
//       {
//         $match: {
//           publicationDate: { $gte: new Date(startDate), $lte: new Date(endDate) }
//         }
//       },
//       { $unwind: "$victims" }, // Unwind the array of victims
//       {
//         $group: {
//           _id: "$victims.industry", // Group by industry
//           count: { $sum: 1 }        // Count the occurrences
//         }
//       },
//       { $sort: { count: -1 } }      // Sort by count in descending order
//     ]);

//     return res.status(200).json(industries);
//   } catch (error) {
//     return res.status(500).json({ message: "An error occurred", error: error.message });
//   }
// };

export const getMostTargetedIndustries = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { startDate = "2023-10-12", endDate = Date.now() } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    console.log(start, end);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (end < start) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    console.log("abhishek");
    const countriesCount = await Incident.find({});

    // const countries = await Incident.aggregate([
    //   {
    //     $unwind: "$data",
    //   },
    //   {
    //     $match: {
    //       "data.row.victims_industry": { $exists: true, $ne: null }, // Exclude documents missing victims_country
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: "$data.row.victims_industry",
    //       count: { $sum: 1 },
    //     },
    //   },
    //   { $sort: { count: -1 } },
    // ]);

    if (countriesCount.length === 0) {
      return res.status(404).json({
        message: "No affected countries found in the specified date range",
      });
    }
    console.log(countriesCount.length)
    return res.status(200).json(countriesCount);
  } catch (error) {
    console.error("Error retrieving incident:", error);
    return res.status(500).json({
      message: "An internal server error occurred",
      error: error.message,
    });
  }
};

export const tableHeadings = async (req, res) => { };

// Export all controllers as a single module
export default {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  searchIncidents,
  getIncidentsById, // Added this line
  getIncidentsByDateRange,
  addImageToIncident,
  removeImageFromIncident,
  getMostActiveThreatActors,
  getMostAffectedCountries,
  getMostTargetedIndustries,
  updateStatus,
  createIncidentByUploadingFile,
  updateRowData,
  getUsersByActivity
};
