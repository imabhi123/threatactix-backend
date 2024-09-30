const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    BENEFICIARIES_ID: {
      type: String,
      required: true,
      unique: true,
      default: "",
    },
    SITE_INSPECTOR_ID: {
      type: String,
      required: true,
      default: "",
    },
    TEAM_ID: {
      type: String,
      required: true,
      default: "",
    },
    SURVEYOR_NAME: {
      type: String,
      required: true,
      default: "",
    },
    SURVEY_DATE: {
      type: Date,
      required: true,
      default: Date.now,
    },
    SITE_LAT_LONG: {
      LAT: {
        type: Number,
        required: true,
      },
      LONG: {
        type: Number,
        required: true,
      },
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
    PUMP_ID: {
      type: String,
      required: true,
    },
    PANEL_IDS: [
      {
        type: String,
        required: true,
      },
    ],
    CONTROLLER_ID: {
      type: String,
      required: true,
    },
    IMEI_NO: {
      type: String,
      required: true,
    },
    STRUCTURE_ID: {
      type: String,
      required: true,
    },
    POLICY_NUMBER: {
      type: String,
    },
    INSTALLED_PUMP_HEAD: {
      type: String,
      enum: ["3HP", "5HP", "7.5HP"],
      required: true,
    },
    REMARK: {
      type: String,
    },
    PHOTO_OF_INSTALLED_STRUCTURE: {
      type: String,
      required: true,
    },
    PHOTO_OF_PUMP_WITH_BENEFICIARY: {
      type: String,
      required: true,
    },
    PHOTO_OF_PUMP_WORKING: {
      type: String,
      required: true,
    },
    SIGNATURE_OF_BENEFICIARY: {
      type: String,
      required: true,
    },
    APPROVAL_VENDOR: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
    REJECTED_REASON_VENDOR: {
      type: String,
      default: "",
    },
    APPROVAL: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      required: true,
    },
    REJECTED_REASON: {
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
Schema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

Schema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

Schema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

Schema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("material_details", Schema);
