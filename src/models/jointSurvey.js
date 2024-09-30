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
    NAME_OF_SURVEYOR: { 
        type: String, 
        required: true, 
        default: '', // Auto fetch should populate this
    },
    SURVEY_DATE: { 
        type: Date, 
        required: true, 
        default: Date.now // Auto fetch current date and time
    },
    SITE_LAT_LONG: {
        LAT: { 
            type: Number, 
            required: true, 
            default: 0.0 // Auto fetch should populate this
        },
        LONG: { 
            type: Number, 
            required: true, 
            default: 0.0 // Auto fetch should populate this
        },
    },
    INSPECTION_OFFICER_NAME: { 
        type: String, 
        required: true, 
        default: '' 
    },
    PRESENT_PERSON: { 
        type: String, 
        required: true, 
        default: '' 
    },
    PHOTO_OF_PUMP: { 
        type: String, 
        required: true 
    },
    PHOTO_OF_PUMP_WITH_BENEFICIARY: { 
        type: String, 
        required: true 
    },
    PHOTO_OF_PUMP_WORKING: { 
        type: String, 
        required: true 
    },
    PHOTO_WITH_OFFICER: { 
        type: String, 
        required: true 
    },
    SIGN: { 
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

module.exports = mongoose.model('joint_survey_details', Schema);
