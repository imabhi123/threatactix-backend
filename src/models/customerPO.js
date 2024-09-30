const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4 } = require("uuid");

const ORDER_INFO = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    PRODUCT_NAME: {
      type: String,
      default: "",
    },
    PRODUCT_ID: {
      type: String,
      default: "",
    },
    NO_OF_SAMPLES: {
      type: Number,
    },
    PRICE: {
      type: Number,
    },
    TOTAL_AMOUNT: {
      type: Number,
    },
    COMPLETED: {
      type: Number,
      default: 0,
    },
    LEFT: {
      type: Number,
      default: 0,
    },
    REMARK: {
      type: String,
      default: "",
    },
    DELETED: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const PO_DETAILS = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    PO_NUMBER: {
      type: String,
      default: "",
    },
    BILLING_ADDRESS: {
      type: String,
    },
    REPORTING_ADDRESS: {
      type: String,
    },
    PO_DATE: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    PO_EXPIRY_DATE: {
      type: Date,
    },
    ORDER_SUMMARY: [ORDER_INFO],
    CREATED_AT: {
      type: Date,
      default: Date.now,
    },
    UPDATED_AT: {
      type: Date,
      default: Date.now,
    },
    CREATED_BY: {
      type: String,
      default: "",
    },
    LAST_MODIFIED_BY: {
      type: String,
      default: "",
    },
    DELETED: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const CONTACT_DETAILS = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    CONTACT_NUMBER: {
      type:[String],
      default:[""]
    },
    CONTACT_EMAIL: {
      type:[String],
      default:[""]
    },
    CONTACT_PERSON: {
      type:String,
      default:""
    },
    DEPARTMENT: {
        type:String,
        default:""
      },
      DESIGNATION: {
        type:String,
        default:""
      },
    REFERENCE: {
        type:String,
        default:""
      },
    DELETED: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const customerPoSchema = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    CUSTOMER_ID: {
      type: String,
      default: "",
      unique: true,
    },
    CUSTOMER_NAME: {
      type: String,
    },
    FULL_ADDRESS: {
      type: String,
    },
    STATE: {
      type: String,
    },
    POST_CODE: {
      type: String,
    },
    CITY: {
      type: String,
    },
    CONTACT_INFO: [CONTACT_DETAILS],
    NOTE: {
      type: String,
      default: "",
    },
    REMARK: {
      type: String,
      default: "",
    },
    GSTIN: {
      type: String,
      default: "",
    },
    PO_INFO: [PO_DETAILS],
    FILES_DETAILS:{
      type:Array,
      default:[]
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
    CREATED_BY: {
      type: String,
      default: "",
    },
    LAST_MODIFIED_BY: {
      type: String,
      default: "",
    },
    STEP: {
      type: Number,
      default: 0,
    },
    DELETED: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

// Middleware to update timestamps
customerPoSchema.pre("save", function (next) {
  if (this.isNew) {
    this.CREATED_AT = Date.now();
  }
  this.UPDATED_AT = Date.now();
  next();
});

customerPoSchema.pre("findOneAndUpdate", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

customerPoSchema.pre("updateOne", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

customerPoSchema.pre("updateMany", function (next) {
  this._update.UPDATED_AT = Date.now();
  next();
});

module.exports = mongoose.model("customerPo", customerPoSchema);
