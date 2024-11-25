import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Ensure the username is stored in lowercase
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    tableHeadings:{
      type:[String],
      required:false
    },
    malwareHeadings:{
      type:[String],
      required:false
    },
    victimHeadings:{
      type:[String],
      required:false
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // Hash password with bcrypt
  next();
});

// Compare password for authentication
adminSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate access token
adminSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Token expiry from env
    }
  );
};

// Generate refresh token
adminSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY, // Token expiry from env
    }
  );
};

export const Admin = mongoose.model("Admin", adminSchema);
