import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    plan: {
      type: {
        planId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Plan",
        },
        purchaseTime: {
          type: Date,
          default: Date.now,
        },
        expiryTime: {
          type: Date,
        },
      },
      default: null, // If no plan is assigned
    },
    verified: {
      type: Boolean,
      default: false
    },
    authProvider: {
      type: String,
      default: ''
    },
    uid: {
      type: String,
      default: ''
    },
    avatar: {
      type: String, // cloudinary url
      // required: true,
    },
    payments: {
      type: Array
    },
    count:{
      type:Number,
      default:0
    },
    status: {
      type: Boolean,
      default: true
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
