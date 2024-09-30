const mongoose = require('mongoose');

const ServiceHistorySchema = new mongoose.Schema({
    BENEFICIARIES_ID: { 
        type: String, 
        // required: true,
    },
    SERVICE_REQUEST_ID: { 
        type: String, 
        // required: true,
    },
    SERVICE_NUMBER: { // Tracks whether this is the 1st, 2nd, etc. service
        type: Number,
        // required: true,
    },
    SERVICE_DATE: { 
        type: Date, 
        // required: true, 
        default: Date.now 
    },
    SERVICE_ENGINEER_ID: { 
        type: String, 
        // required: true 
    },
    SERVICE_ENGINEER_NAME:{
        type:String,
        default:""
    },
    PANELS_REPLACED: [{ 
        OLD: { type: String, required: true }, // Old panels replaced
        NEW: { type: String, required: true }, // New panels installed
    }],
    CONTROLLER_REPLACED: {
        type:String,
        default:""
    },
    PUMP_REPLACED: { // Optionally track pump replacement
        type:String,
        default:""
    },
    INSTALLED_PUMP_HEAD: { 
        type: String, 
        enum: ['3HP', '5HP', '7.5HP'], 
    },
    IMEI_NO: { 
        type: String, 
        // required: true 
    },
    STRUCTURE_ID: { 
        type: String, 
        // required: true 
    },
    REMARKS: { 
        type: String 
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
},
{ versionKey: false });

// Middleware to update timestamps
ServiceHistorySchema.pre("save", function (next) {
    if (this.isNew) {
        this.CREATED_AT = Date.now();
    }
    this.UPDATED_AT = Date.now();
    next();
});

module.exports = mongoose.model('service_history', ServiceHistorySchema);
