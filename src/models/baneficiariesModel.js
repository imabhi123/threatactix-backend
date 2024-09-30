const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const beneficiarySchema = new Schema(
  {
    ID: {
      type: String,
      default: () => v4(),
    },
    application_no: {
      type: String,
      default:"",
      // required: true,
    },
    Beneficiary_Name: {
      type: String,
      default:"",
      // required: true,
    },
    district_name: {
      type: String,
      default:"",
      // required: true,
    },
    dist_code: {
      type: String,
      default:"",
      // required: true,
    },
    taluka: {
      type: String,
      default:"",
      // required: true,
    },
    taluka_code: {
      type: String,
      default:"",
      // required: true,
    },
    village: {
      type: String,
      default:"",
      // required: true,
    },
    village_code: {
      type: String,
      default:"",
      // required: true,
    },
    mobile: {
      type: String,
      default:"",
      // required: true,
    },
    pump_required: {
      type: String,
      default:"",
      // required: true,
    },
    cast_category: {
      type: String,
      default:"",
      // required: true,
    },
    aadhar: {
      type: String,
      default: "",
    },
    Pan: {
      type: String,
      default: "",
    },
    aadhar_doc_link: {
      type: String,
      default: "",
    },
    Pan_doc_link: {
      type: String,
      default: "",
    },
    irr_source: {
      type: String,
      default:"",
      // required: true,
    },
    irr_src_depth: {
      type: String,
      default:"",
      // required: true,
    },
    JSR: {
      type: String,
      default:"",
    },
    IMEI: {
      type: String,
      default:"",
      // required: true,
    },
    pump_id: {
      type: String,
      default:"",
      // required: true,
    },
    lat: {
      type: String,
      default:"",
      // required: true,
    },
    long: {
      type: String,
      default:"",
      // required: true,
    },
    survey_stage: {
      type: Boolean,
      default:false,
    },
    material_unload_stage: {
      type: Boolean,
      default:false,
    },
    InstallationStatus: {
      type: Boolean,
      default: false,
    },
    // vendor assign param
    is_vendor_assigned:{
      type:Boolean,
      default:false
    },
    assigned_vendor_name:{
      type:String,
      default:"NA"
    },
    assigned_vendor_id:{
      type:String,
      default:""
    },
    // policy assign param
    is_policy_assigned:{
      type:Boolean,
      default:false
    },
    assigned_policy_name:{
      type:String,
      default:"NA"
    },
    assigned_policy_id:{
      type:String,
      default:""
    },
    // Site Inspector Assign 
    is_site_installation_assigned:{
      type:Boolean,
      default:false
    },
    assigned_site_installation_name:{
      type:String,
      default:"NA"
    },
    assigned_site_installation_id:{
      type:String,
      default:""
    },
    COMMENTS:{
      type:Array,
      default:[]
    },
    IS_DONE: {
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
  beneficiarySchema.pre("save", function (next) {
    if (this.isNew) {
      this.CREATED_AT = Date.now();
    }
    this.UPDATED_AT = Date.now();
    next();
  });
  
  beneficiarySchema.pre("findOneAndUpdate", function (next) {
    this._update.UPDATED_AT = Date.now();
    next();
  });
  
  beneficiarySchema.pre("updateOne", function (next) {
    this._update.UPDATED_AT = Date.now();
    next();
  });
  
  beneficiarySchema.pre("updateMany", function (next) {
    this._update.UPDATED_AT = Date.now();
    next();
  });

module.exports = mongoose.model("Beneficiary", beneficiarySchema);
