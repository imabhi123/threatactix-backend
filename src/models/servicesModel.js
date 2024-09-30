const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const servicesSchema = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    SERVICE_NAME: {
      type: String,
      required: true,
    },
    DESCRIPTION: {
      type: String,
      required: true,
    },
    PRICE: {
      type: String,
      default: 0,
      required: true,
    },
    CREATED_BY: {
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
servicesSchema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

servicesSchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

servicesSchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

servicesSchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("services", servicesSchema);
