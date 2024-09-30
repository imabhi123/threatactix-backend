const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const subServiceSchema = new Schema(
  {
    ID: {
        type: String,
        default: () => v4(),
      },
    MAIN_SERVICE_ID: {
      type: String,
      required:true
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
subServiceSchema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

subServiceSchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

subServiceSchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

subServiceSchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("sub-services", subServiceSchema);
