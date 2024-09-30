const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4 } = require("uuid");

const contactSchema = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    USER_ID: {
      type: String,
    },
    NAME: {
      type: String,
      required: true,
    },
    PHONE_NUMBER: {
      type: String,
      required: true,
      unique:true
    },
    EMAIL: {
      type: String,
      required: true,
    },
    IS_FAVORITE: {
      type: Boolean,
      default: false,
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
contactSchema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

contactSchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

contactSchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

contactSchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("contacts", contactSchema);
