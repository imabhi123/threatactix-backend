const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const stateSchema = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    STATE_NAME: {
      type: String,
      required: true,
      unique:true
    },
    IS_ACTIVE: {
      type: Boolean,
      required: true,
      default:true
    },
    STATE_CODE: {
      type: String,
      default: 0,
      unique:true
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
stateSchema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

stateSchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

stateSchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

stateSchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("states", stateSchema);
