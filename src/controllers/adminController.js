import { Admin } from "../models/adminModel.js";
import jwt from "jsonwebtoken";
import Incident from "../models/IncidentSchema.js";
import { User } from "../models/userModel.js";

// Login Controller
// export const loginAdmin = async (req, res) => {
//   const { username, password } = req.body;
//   console.log(username, password);

//   // Check if username and password are provided
//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ message: "Username and password are required" });
//   }

//   try {
//     // Find admin by username
//     let admin = await Admin.findOne({ username });

//     // If admin doesn't exist, create a new admin
//     if (!admin) {
//       console.log("--> Admin not found, creating a new one");

//       // Create new admin (password will be hashed by the pre-save hook)
//       const newAdmin = new Admin({
//         username,
//         password, // Just pass the plain password, it will be hashed automatically
//       });

//       // admin = newAdmin;

//       // Save the new admin to the database
//       await newAdmin.save();

//       // After creating the new admin, log in successfully
//       const accessToken = admin.generateAccessToken();
//       const refreshToken = admin.generateRefreshToken();
//       admin.refreshToken = refreshToken;

//       await admin.save();

//       // Return success message with tokens
//       return res.status(200).json({
//         accessToken,
//         refreshToken,
//         message: "Admin created and logged in successfully",
//       });
//     }

//     // If admin exists, check if the password is correct
//     const isPasswordValid = await admin.isPasswordCorrect(password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // Generate access token
//     const accessToken = admin.generateAccessToken();

//     // Generate refresh token
//     const refreshToken = admin.generateRefreshToken();

//     // Save refresh token to the admin document in the database
//     admin.refreshToken = refreshToken;
//     await admin.save();

//     // Send tokens as a response
//     res.status(200).json({
//       accessToken,
//       refreshToken,
//       message: "Login successful",
//     });
//   } catch (error) {
//     console.error("Login error: ", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Find admin by username
    let admin = await Admin.findOne({ username });

    // If admin doesn't exist, create a new admin
    if (!admin) {
      console.log("--> Admin not found, creating a new one");

      // Create new admin (password will be hashed by the pre-save hook)
      admin = new Admin({
        username,
        password, // Pass the plain password; it will be hashed automatically
      });

      // Save the new admin to the database
      await admin.save();

      // Generate tokens for the new admin
      const accessToken = admin.generateAccessToken();
      const refreshToken = admin.generateRefreshToken();
      admin.refreshToken = refreshToken;

      await admin.save();

      // Return success message with tokens
      return res.status(200).json({
        accessToken,
        refreshToken,
        admin,
        message: "Admin created and logged in successfully",
      });
    }

    // If admin exists, check if the password is correct
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate tokens for existing admin
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    // Save the refresh token to the admin document in the database
    admin.refreshToken = refreshToken;
    await admin.save();
    console.log(admin);

    // Send tokens as a response
    res.status(200).json({
      accessToken,
      refreshToken,
      admin,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleServerError = (res, error, message) => {
  res.status(500).json({ message, error });
};

export const getIncidents = async (req, res) => {
  try {
    // Extract start and end from the query parameters
    const { start = 0, end = 10 } = req.query; // Default to 0 and 10 if not provided

    // Ensure that start and end are integers
    const startIndex = parseInt(start);
    const endIndex = parseInt(end);

    // Fetch incidents with pagination
    const incidents = await Incident.find()
      .skip(startIndex) // Skip documents to start pagination
      .limit(endIndex - startIndex); // Limit the number of documents returned

    res.status(200).json({
      success: true,
      data: incidents,
      pagination: {
        start: startIndex,
        end: endIndex,
        count: incidents.length, // Number of incidents returned
      },
    });
  } catch (error) {
    handleServerError(res, error, "Error retrieving incidents");
  }
};

export const incidentStatusUpdate = async (req, res) => {
  try {
    const { id, status } = req.body;

    // Find the incident by ID
    const incident = await Incident.findById(id);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // Update the incident's status
    incident.status = status;
    await incident.save(); // Save the changes to the database

    res.status(200).json({
      success: true,
      message: "Status successfully changed",
      updatedIncident: incident,
    });
  } catch (error) {
    console.error("Error updating incident status:", error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

export const getProfile = async (req, res) => {
  const { token } = req.body;

  // Check if the token is provided
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    // Verify the token
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the admin using the ID from the decoded token
    const admin = await Admin.findById(decoded._id);

    // If admin is not found
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Generate a new access token
    const newAccessToken = admin.generateAccessToken();

    // Send the profile details and new token in the response
    res.status(200).json({
      username: admin.username,
      accessToken: newAccessToken,
      message: "Profile fetched successfully",
    });
  } catch (error) {
    console.error("Profile fetch error: ", error);

    // If token is invalid or expired
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again" });
    }

    // Other errors related to token verification
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const updateTableHeading = async (req, res) => {
  const { userId, headings } = req.body;
  const admin = await Admin.findById(userId);
  if (!admin) {
    return res.status(400).json({ message: "Admin does not exists" });
  }
  const newAdmin = await Admin.findByIdAndUpdate(
    userId, // use userId as the document's _id
    { tableHeadings: headings }, // update tableHeadings
    { new: true } // return the updated document
  );

  res.status(200).json({
    message: "Heading Changed successfully!",
    data: newAdmin,
  });
};

export const updateMalwareTableHeading = async (req, res) => {
  const { userId, headings } = req.body;
  const admin = await Admin.findById(userId);
  if (!admin) {
    return res.status(400).json({ message: "Admin does not exists" });
  }
  const newAdmin = await Admin.findByIdAndUpdate(
    userId, // use userId as the document's _id
    { malwareHeadings: headings }, // update tableHeadings
    { new: true } // return the updated document
  );

  res.status(200).json({
    message: "Heading Changed successfully!",
    data: newAdmin,
  });
};

export const getTableHeadings = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the admin by userId
    const admin = await Admin.findById(userId);

    // Check if admin exists
    if (!admin) {
      return res.status(400).json({ message: "Admin does not exist" });
    }

    // Respond with the tableHeadings
    res.status(200).json({
      message: "Table headings retrieved successfully!",
      data: admin.tableHeadings,
    });
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({
      message: "An error occurred while retrieving the table headings.",
      error: error.message,
    });
  }
};
export const getMalwareTableHeadings = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the admin by userId
    const admin = await Admin.findById(userId);

    // Check if admin exists
    if (!admin) {
      return res.status(400).json({ message: "Admin does not exist" });
    }
    console.log(admin)
    // Respond with the tableHeadings
    res.status(200).json({
      message: "Table headings retrieved successfully!",
      data: admin.malwareHeadings,
    });
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({
      message: "An error occurred while retrieving the table headings.",
      error: error.message,
    });
  }
};

export const getAllUsers=async(req,res)=>{
  try {
    const users=await User.find({});
    res.status(200).json({
      message: "Table headings retrieved successfully!",
      data: users,
    });
  } catch (error) {
    
  }
}
