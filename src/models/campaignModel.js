import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const campaignSchema = new Schema(
  { 
    name: {
      type: String,
      required: [true, "Campaign name is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, "Campaign name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    attacksCount: {
      type: Number,
      required: [true, "Number of attacks is required"],
      min: [0, "C2 Collection Count cannot be negative"],
      default: 0,
      index: true,
    },
    targets: {
      type: [String],
      required: [true, "At least one target is required"],
      validate: {
        validator: function(v) {
          return v.length > 0;
        },
        message: "At least one target must be specified",
      },
      index: true,
    },
  },
  {
    timestamps: true,
  }
);


export const Campaign = mongoose.model("Campaign", campaignSchema);