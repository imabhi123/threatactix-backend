const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4 } = require("uuid");

const serial_numerSchema = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    CUSTOMER_NUMBER: {
      type: Number,
      default: 0,
    },
    PO_NUMBER: {
        type: Number,
        default: 0,
      },
    QUOTATION_NUMBER: {
        type: Number,
        default: 0,
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
serial_numerSchema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

serial_numerSchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

serial_numerSchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

serial_numerSchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("serail_number", serial_numerSchema);
