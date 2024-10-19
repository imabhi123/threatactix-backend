import { ApiError } from "../utils/ApiError.js";

// Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  // If the error is an instance of ApiError, use the error's status code and message
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message || "An error occurred",
    });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: err.message || "Validation error occurred",
    });
  }

  // For unhandled errors, return a generic message with status 500
  return res.status(500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};

export default errorHandler ;
