const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const SCHEMA = new Schema(
  {
    ID:{
      type:String,
      required: true,
    },
    NAME: {
      type: String,
      required: true,
    },
    VENDOR_TYPE: {
      type: String,
      required: true,
      default: ""
    },
    PHONE_NUMBER: {
      type: String,
      default: "",
    },
    EMAIL_ADDR: {
      type: String,
      default: "",
    },
    ADDRESS: {
      type: String,
      default: "",
    },
    DISTRICT: {
      type: String,
      default: "",
    },
    STATE: {
      type: String,
      default: "",
    },
    TEHSIL: {
      type: String,
      default: "",
    },
    VILLAGE: {
      type: String,
      default: "",
    },
    PINCODE: {
      type: String,
      default: "",
    },
    CREATED_AT: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    UPDATED_AT: {
      type: Date,
      default: Date.now,
    },
    DELETED: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

// Middleware to update timestamps
SCHEMA.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

SCHEMA.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

SCHEMA.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

SCHEMA.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("vendors", SCHEMA);
