const mongoose = require('mongoose');

const surveySchema = new mongoose.Schema({
    BENEFICIARIES_ID: { 
        type: String, 
        required: true, 
        default: '' 
    },
    SITE_INSPECTOR_ID: { 
        type: String, 
        required: true, 
        default: '' 
    },
    TEAM_ID: { 
        type: String, 
        required: true, 
        default: '' 
    },
    SURVEYOR_NAME: { 
        type: String, 
        required: true, 
        default: '' 
    },
    SURVEY_DATE: { 
        type: Date, 
        required: true, 
        default: Date.now 
    },
    FARMER_ALTERNATIVE_MOBILE_NO: { 
        type: String, 
        required: true 
    },
    SITE_LAT_LONG: {
        LAT: { 
            type: Number, 
            required: true 
        },
        LONG: { 
            type: Number, 
            required: true 
        },
    },
    WATER_SOURCE_AVAILABLE: { 
        type: String, 
        enum: ['YES', 'NO'], 
        required: true 
    },
    WATER_SOURCE_TYPE: { 
        type: String, 
        enum: ['WELL', 'BOREWELL', 'RIVER', 'SHETTALE', 'LAKE'], 
        default:"WELL"
    },
    WATER_SOURCE_DEPTH: { 
        type: String, 
        default:""
    },
    CONSTANT_WATER_LEVEL: { 
        type: String, 
        default:""
    },
    WATER_DELIVERY_POINT_LENGTH: { 
        type: String, 
        default:""
    },
    PUMP_TYPE: { 
        type: String, 
        enum: ['SUBMERSIBLE', 'SURFACE'], 
        required: true ,
        default:"SUBMERSIBLE"
    },
    PUMP_HEAD_RECOMMENDED_BY_SURVEYOR: { 
        type: String, 
        required: true 
    },
    PUMP_HEAD_RECOMMENDED_BY_BENEFICIARY: { 
        type: String, 
        required: true 
    },
    AG_PUMP_ELECTRICITY_CONNECTION_AVAILABLE: { 
        type: String, 
        enum: ['YES', 'NO'], 
        required: true 
    },
    CONSUMER_NO: { 
        type: String 
    },
    SOLAR_PUMP_INSTALLED_UNDER_SCHEME: { 
        type: String, 
        enum: ['YES', 'NO'], 
        required: true 
    },
    SCHEME_NAME: { 
        type: String 
    },
    SHADOW_FREE_AREA_AVAILABLE: { 
        type: String, 
        enum: ['YES', 'NO'], 
        required: true 
    },
    MOBILE_NETWORK_AVAILABLE: { 
        type: String, 
        enum: ['YES', 'NO'], 
        required: true 
    },
    AVAILABLE_PERSONS: { 
        type: [String], 
        enum: ['FIELD ENGINEER', 'FARMER', 'GOVT ENGINEER'], 
        required: true 
    },
    REMARK: { 
        type: String 
    },
    PHOTO_WATER_SOURCE: { 
        type: String, 
        required: true 
    },
    PHOTO_LANDMARK: { 
        type: String, 
        required: true 
    },
    PHOTO_WITH_BENEFICIARY: { 
        type: String, 
        required: true 
    },
    BENEFICIARY_SIGN: { 
        type: String, 
        required: true 
    },
    SURVEYOR_SIGN: { 
        type: String, 
        required: true 
    },
    APPROVAL_VENDOR: { 
        type: String, 
        enum: ['PENDING', 'APPROVED', 'REJECTED'], 
        default:"PENDING"
    },
    REJECTED_REASON_VENDOR: { 
        type: String
    },
    APPROVAL: { 
        type: String, 
        enum: ['PENDING', 'APPROVED', 'REJECTED'], 
        default:"PENDING"
    },
    REJECTED_REASON: { 
        type: String,
        default:""
    },
    MATERIAL_UNLOAD_STATUS:{
        type:Boolean,
        default:false
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
{ versionKey: false });


// Middleware to update timestamps
surveySchema.pre("save", function (next) {
    if (this.isNew) {
      this.CREATED_AT = Date.now();
    }
    this.UPDATED_AT = Date.now();
    next();
  });
  
  surveySchema.pre("findOneAndUpdate", function (next) {
    this._update.UPDATED_AT = Date.now();
    next();
  });
  
  surveySchema.pre("updateOne", function (next) {
    this._update.UPDATED_AT = Date.now();
    next();
  });
  
  surveySchema.pre("updateMany", function (next) {
    this._update.UPDATED_AT = Date.now();
    next();
  });

module.exports = mongoose.model('Survey', surveySchema);
