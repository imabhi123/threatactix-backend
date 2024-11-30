import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import Plan from "../models/planSchema.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateAccessToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError( 
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);

  // Validate required fields
  if (
    [firstName, lastName, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "Please provide all required fields");
  }
  console.log("--->abhishek");
  // Check if the user already exists
  const existedUser = await User.findOne({ email });
  console.log(existedUser, "--->abhishekk");

  if (existedUser) {
    throw new ApiError(409, "User with this email already exists");
  }
  // Create new user
  const user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    password,
  });

  console.log(user, "--->abhishek");

  // Retrieve user without password and refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  // Respond with success
  return res
    .status(201)
    .json(new ApiResponse(201, "User registered successfully", createdUser));
});

const googleRegisterUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, uid } = req.body;
  console.log(req.body);

  // Validate required fields
  if ([firstName, lastName, email, uid].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Please provide all required fields");
  }

  console.log("---> Google Register Handler");

  // Check if the user already exists
  let user = await User.findOne({ email });
  console.log(user, "---> Existing User Check");

  if (user) {
    // If user exists, check if their UID matches
    if (user.uid !== uid) {
      throw new ApiError(
        409,
        "User with this email already exists but UID does not match"
      );
    }
    // Return the existing user
    console.log(user, "---> Returning Existing User");
    return res
      .status(200)
      .json(new ApiResponse(200, "User logged in successfully", user));
  }

  // Create a new user if not exists
  user = await User.create({
    firstName,
    lastName,
    email: email.toLowerCase(),
    uid,
    authProvider: "google", // Optional field to track the provider
  });

  console.log(user, "---> New User Created");

  // Retrieve user without sensitive fields like password or refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user"
    );
  }

  // Respond with success
  return res
    .status(201)
    .json(
      new ApiResponse(201, "User registered successfully", createdUser)
    );
});

export const changeUserStatus = async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a route parameter
  const { status } = req.body;  // New status passed in the request body

  try {
    // Validate input
    if (typeof status !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid status. It must be a boolean value.",
      });
    }

    // Find and update the user's status
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Respond with the updated user
    res.status(200).json({
      success: true,
      message: "User status updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the user status.",
    });
  }
};

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Ensure email and password are provided
  if (!email || !password) {
    throw new ApiError(400, "Please provide both email and password");
  }

  // Find user by email
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "Invalid credentials");
  }

  // Validate password
  const isPassValid = await user.isPasswordCorrect(password);

  if (!isPassValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // Fetch user data without sensitive fields
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Cookie options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "None",
  };

  // Set cookies and return response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

const googleLoginUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, uid } = req.body;

  // Validate required fields
  if ([firstName, lastName, email, uid].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields (firstName, lastName, email, uid) are required.");
  }

  // Check if the user already exists
  let user = await User.findOne({ email });
  console.log(user,'-->',uid);
  if (!user) {
    // Create a new user if none exists
    user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      _uid,
      authProvider: "google",
    });
    console.log(user)
  } else if (user.authProvider !== "google" || user.uid !== uid) {
    // If the user exists but has mismatched or different auth details
    throw new ApiError(401, "Authentication failed due to mismatched credentials.");
  }

  // Generate a JWT or similar token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );
  // Exclude sensitive fields before sending the response
  const safeUser = await User.findById(user._id).select("-password -refreshToken");

  if (!safeUser) {
    throw new ApiError(500, "Failed to retrieve user information.");
  }

  // Respond with success
  res.status(200).json({
    message: "User authenticated successfully.",
    user: safeUser,
    accessToken: accessToken,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  console.log(req.user._id, "abhishek");
  await User.findByIdAndUpdate(
    req.user._id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confPassword } = req.body;

  if (newPassword !== confPassword) {
    throw new ApiError(
      400,
      "New password and confirmation password do not match"
    );
  }

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const purchasePlan = async (req, res) => {
  const { userId, planId, formData,duration } = req.body;
  console.log(duration);
  try {
    console.log(req.body);

    // Find the user and plan
    const user = await User.findById(userId);
    const plan = await Plan.findById(planId);

    console.log(user);

    // Validate user and plan existence
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Push the new formData into the payments array
    user.payments.push(formData);
    const purchaseTime = new Date();
    let expiryTime = null;
    if (duration === "monthly") {
      expiryTime = new Date(purchaseTime.setMonth(purchaseTime.getMonth() + 1));
    } else if (duration === "yearly") {
      expiryTime = new Date(purchaseTime.setFullYear(purchaseTime.getFullYear() + 1));
    }

    // Update user's plan with required details
    user.plan = {
      planId: plan._id,
      purchaseTime: new Date(),
      expiryTime, // Ensure expiryTime is passed in formData or set null
    };

    // Save the user document
    await user.save();

    res.status(200).json({ message: "Plan purchased successfully", user });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while purchasing the plan", error: error.message });
  }
};

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;

  if (!firstName || !lastName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { firstName, lastName, email: email.toLowerCase() } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserprofilePicture = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar on cloudinary");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { avatar: avatar.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserprofilePicture,
  purchasePlan,
  googleRegisterUser,
  googleLoginUser
};
