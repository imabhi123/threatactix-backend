const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const districtSchema = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    DISTRICT_NAME: {
      type: String,
      required: true,
      unique:true
    },
    STATE_ID: {
      type: String,
      required:true
    },
    IS_ACTIVE: {
      type: Boolean,
      required: true,
      default:true
    },
    CODE: {
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
districtSchema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

districtSchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

districtSchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

districtSchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("districts", districtSchema);
