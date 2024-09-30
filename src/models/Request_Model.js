const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4 } = require("uuid");


// Function to generate a human-readable ID like REQ_786789
const generateServiceRequestId = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 90000000); // Generates a 6-digit random number
  return `REQ_${randomNumber}`;
};

const serviceRequestSchema = new Schema(
  {
    SERVICE_REQUEST_ID: {
      type: String,
      default: () => generateServiceRequestId(),  // Custom readable ID hai
    },
    REQUEST_TYPE: {
      type: String,
      required: true,
    },
    FARMER_ID: {
      type: String,
      required: true,
    },
    FARMER_NAME: {
      type: String,
      required: true,
    },
    SERVICE_TYPE: {
      type: String,
      default: "",
    },
    DESCRIPTION: {
      type: String,
      dafault: "",
    },
    PHOTOS: {
      type: [String],
      default: [],
    },
    PHOTOS_BY_ENGINEER: {
      type: [String],
      default: [],
    },
    INSURANCE_CLAIM: {
      type: String,
      default: "",
    },
    POLICY_NUMBER: {
      type: String,
      default: "",
    },
    INSURANCE_COMPANY_NAME: {
      type: String,
      default: "",
    },
    REASON: {
      type: String,
      default: "",
    },
    ESTIMATE_DONE: {
      type: Boolean,
      default: false,
    },
    VENDOR_ASSIGN: {
      type: Boolean,
      default: false,
    },
    IS_ASSIGNED_ENGINEER: {
      type: Boolean,
      default: false,
    },
    ASSIGNED_ENGINEER_NAME: {
      type: String,
      default: "",
    },
    ASSIGNED_ENGINEER_ID: {
      type: String,
      default: "",
    },
    REQUEST_STATUS: {
      type: String,
      enum: ["Pending", "In Progress", "Completed", "Closed"],
      default: "Pending",
    },
    TEAM_ID: {
      type: String,
      default: "",
    },
    VENDOR_NAME: {
      type: String,
      default: "",
    },
    COMMENT: {
      type: String,
      default: "",
    },
    CONTROLLER_COMMENT: {
      type: String,
      default: "",
    },
    PUMP_COMMENT: {
      type: String,
      default: "",
    },
    STRUCTURE_COMMENT: {
      type: String,
      default: "",
    },
    PANNELS_COMMENT: {
      type: String,
      default: "",
    },
    VENDOR_APPROVAL: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    VENDOR_REJECTED_REASON: {
      type: String,
      default: "",
    },
    ADMIN_APPROVAL: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    ADMIN_REJECTED_REASON: {
      type: String,
      default: "",
    },
    UPLOADED_DOCUMENTS: [
      {
        titile: {
          type: String,
          default: "",
        },
        filePath: {
          type: String,
          default: "",
        },
      },
    ],
    UPLOADED_PHOTOS: [
      {
        titile: {
          type: String,
          default: "",
        },
        filePath: {
          type: String,
          default: "",
        },
      },
    ],
    FARMER_COMMENT:{
      type:String,
      default:""
    },
    SITE_LAT_LONG: {
      LAT: { 
          type: String, 
          required: true 
      },
      LONG: { 
          type: String, 
          required: true 
      },
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
serviceRequestSchema.pre("save", function (next) {
  if (this.isNew) {
    this.SERVICE_REQUEST_DATE = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

serviceRequestSchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

serviceRequestSchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

serviceRequestSchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("requests", serviceRequestSchema);
