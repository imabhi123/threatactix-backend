import mongoose,{Schema} from "mongoose";


const userSchema = new Schema({
    USER_ID: {
        type: String,
        required: true,
      },
    FIRST_NAME: {
      type: String,
      required: true,
      maxLength: 31,
    },
    LAST_NAME: {
      type: String,
      maxLength: 31,
    },
    FATHER_NAME: {
      type: String,
      maxLength: 31,
    },
    DATE_OF_BIRTH: {
      type: String,
      maxLength: 31,
    },
    ADDRESS: {
      type: String,
    },
    STATE: {
      type: String,
    },
    DISTRICT: {
      type: String,
    },
    SUB_DISTRICT: {
      type: String,
    },
    VILLAGE: {
      type: String,
    },
    EMAIL_ADDRESS: {
      type: String,
      required: true,
      maxLength: 255,
    },
    PHONE_NUMBER:{
      type:String,
      required:true
    },
    IMAGE_URL:{
      type:String,
      default:""
    },
    GENDER:{
      type:String,
      enum:["MALE" , "FEMALE" , "OTHER"],
      default:"MALE"
    },
    FCM_TOKEN:{
      type:String,
      default:""
    },
    TEAM_ID: {
      type: String,
      default:""
    },
    BLOCKED:{
      type:Boolean,
      default:false
    },
    CREATED_AT: {
      type:Date
    },
    UPDATED_AT: {
      type: Date
    }
  },
  { versionKey: false }
);

const User = mongoose.model("users", userSchema);
export  {User};