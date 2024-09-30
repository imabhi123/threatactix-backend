const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    BENEFICIARIES_ID: { 
        type: String, 
        required: true, 
        unique:true,
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
    PRESENT_PERSON_NAME: { 
        type: String, 
        required: true, 
        default: '' 
    },
    SURVEY_DATE: { 
        type: Date, 
        required: true, 
        default: Date.now 
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
    BENEFICIARY_SIGN: { 
        type: String, 
        required: true 
    },
    PHOTO_OF_DELIVERED_MATERIAL: { 
        type: String, 
        required: true 
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

module.exports = mongoose.model('material_unloads', Schema);
