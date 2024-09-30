import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    console.log(userId);
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
  const { fullName, email, username, password, role, bio } = req.body;
  console.log(req.body);

  // Validate required fields
  if (
    [fullName, email, username, password, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please provide all required fields");
  }

  // Check if the user already exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  // Check for profile picture
  const profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;
  if (!profilePictureLocalPath) {
    throw new ApiError(400, "Profile picture is required");
  }

  // Upload profile picture to Cloudinary
  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
  if (!profilePicture) {
    throw new ApiError(500, "Failed to upload profile picture");
  }

  // Create new user
  const user = await User.create({
    fullName,
    email,
    username: username.toLowerCase(),
    password,
    role,
    bio,
    profilePicture: profilePicture.url, // Add the uploaded profile picture
  });

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

const loginUser = asyncHandler(async (req, res) => {
  console.log(req.body);

  const { email, username, password } = req.body;

  // Ensure username or email is provided
  if (!(username || email)) {
    throw new ApiError(400, "Please provide either a username or email");
  }

  // Find user by username or email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

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

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
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

    const user = User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or used");
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
    throw new ApiError(401, error?.message || "invalid refresh token");
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

  const user = await User.findById(req.user?._id);
  console.log(user);
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

const getCurrentUser = asyncHandler(async (req, res) => {
  // Fetch the currently authenticated user
  // console.log(req.user)
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Return the user data
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserprofilePicture = asyncHandler(async (req, res) => {
  const profilePictureLocalPath = req.file?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError(400, "profilePicture file is missing");
  }

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  if (!profilePicture.url) {
    throw new ApiError(
      400,
      "Error while uploading profilePicture on cloudinary"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { profilePicture: profilePicture.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "profilePicture updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing");
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage.url) {
    throw new ApiError(
      400,
      "Error while uploading profilePicture on cloudinary"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "cover image updated successfully"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "username is missing");
  }

  const channel = User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        profilePicture: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new ApiError(404, "channel does not exists");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, channel[0], "User channel fetched successfully")
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    profilePicture: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0].watchHistory,
        "watch history fetched successfully"
      )
    );
});

const additionalInfo = async (req, res) => {
  console.log("KAPIL");
  console.log(req?.files);

  try {
    const {
      DOCUMENTS_TITLE,
      UPLOADSPHOTOS_TITLE,
      FARMER_COMMENT,
      SITE_LAT_LONG,
    } = req.body;
    console.log(req.body)

    // Fetch the existing record from the database using the ID from the request
    // const existingRecord = await Request_Model.findOne({
    //   SERVICE_REQUEST_ID: req.body.SERVICE_REQUEST_ID,
    // });

    // if (!existingRecord) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Record not found. Please provide a valid SERVICE_REQUEST_ID.",
    //   });
    // }

    // Initialize arrays to handle updates
    // let uploadedDocuments = existingRecord.UPLOADED_DOCUMENTS || [];
    // let uploadedPhotos = existingRecord.UPLOADED_PHOTOS || [];

    /** DOCUMENTS & UPLOADS PHOTOS LOGIC **/

    // const documentsArray = req.files?.DOCUMENTS || [];
    // const uploadsPhotosArray = req.files?.UPLOADSPHOTOS || [];

    // // Validate title lengths against array lengths only if both arrays exist
    // if (documentsArray?.length && DOCUMENTS_TITLE?.length) {
    //   if (documentsArray.length !== DOCUMENTS_TITLE.length) {
    //     return res.status(403).json({
    //       success: false,
    //       message: `Documents title length (${DOCUMENTS_TITLE.length}) must be equal to documents array length (${documentsArray.length})`,
    //     });
    //   }
    // }

    // if (uploadsPhotosArray?.length && UPLOADSPHOTOS_TITLE?.length) {
    //   if (uploadsPhotosArray.length !== UPLOADSPHOTOS_TITLE.length) {
    //     return res.status(403).json({
    //       success: false,
    //       message: `Uploads photos title length (${UPLOADSPHOTOS_TITLE.length}) must be equal to uploads photos array length (${uploadsPhotosArray.length})`,
    //     });
    //   }
    // }

    // // Process and upload the new documents (if any)
    // for (let i = 0; i < documentsArray.length; i++) {
    //   const document = documentsArray[i];
    //   const title = DOCUMENTS_TITLE[i] || "NA"; // Use "NA" as a fallback
    //   // Save the file path and title
    //   uploadedDocuments.push({ title, filePath: document.path });
    // }

    // // Process and upload the new photos (if any)
    // for (let i = 0; i < uploadsPhotosArray.length; i++) {
    //   const filePath = uploadsPhotosArray[i]?.path;
    //   const title = UPLOADSPHOTOS_TITLE[i] || "NA"; // Use "NA" as a fallback
    //   // Save the file path and title
    //   uploadedPhotos.push({ title, filePath });
    // }

    // Update the record with new documents and photos
    // const updatedRecord = await Request_Model.findOneAndUpdate(
    //   { SERVICE_REQUEST_ID: req.body.SERVICE_REQUEST_ID },
    //   {
    //     UPLOADED_DOCUMENTS: uploadedDocuments,
    //     UPLOADED_PHOTOS: uploadedPhotos,
    //     SITE_LAT_LONG,
    //     FARMER_COMMENT,
    //     UPDATED_AT: new Date(),
    //   },
    //   { new: true }
    // );

    // Respond with the updated record
    return res.status(200).json({
      success: true,
      message: "Additional Info Saved successfully",
      data: [],
    });
  } catch (error) {
    console.error("Error updating record:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the record",
    });
  }
};

export {
  registerUser, 
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserprofilePicture,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
  additionalInfo,
};
