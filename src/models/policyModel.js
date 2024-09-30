const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4 } = require("uuid");

const policySchema = new Schema(
  {
    POLICY_ID: {
      type: String,
      default: () => v4(),
    },
    USER_ID: {
      type: String,
    },
    POLICY_NAME: {
      type: String,
      required: true,
    },
    POLICY_NUMBER: {
      type: String,
      required: true,
    },
    POLICY_TYPE: {
      type: String,
      required: true,
    },
    POLICY_AMOUNT: {
      type: Number,
      required: true,
    },
    PREMIUM_AMOUNT: {
      type: Number,
      required: true,
    },
    URL:{
      type:String,
      default:""
    },
    START_DATE: {
      type: Date,
      required: true,
    },
    END_DATE: {
      type: Date,
      required: true,
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
policySchema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

policySchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

policySchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

policySchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("policies", policySchema);
