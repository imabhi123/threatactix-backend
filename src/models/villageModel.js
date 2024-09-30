const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const villagesSchema = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    STATE_ID: {
      type: String,
      required: true,
    },
    DISTRICT_ID: {
      type: String,
      required: true,
    },
    SUB_DISTRICT_ID: {
      type: String,
      required: true,
    },
    VILLAGE_NAME: {
      type: String,
      required: true,
      unique:true
    },
    IS_ACTIVE: {
      type: Boolean,
      required: true,
      default: true,
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
villagesSchema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

villagesSchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

villagesSchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

villagesSchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("villages", villagesSchema);
