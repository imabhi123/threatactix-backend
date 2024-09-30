const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    USER_ID: {
      type: String,
      required: true,
    },
    NOTIFICATION: {
      type:String,
      default: () => v4(),
    },
    TITLE: {
      type: String,
      default:"",
    },
    MESSAGE: {
      type: String,
    },
    SEND_AT: {
      type: Date,
      default:Date.now()
    },
    FILE_PATH:{
      type:String,
      default:""
    },
    IS_READ: {
      type: Boolean,
      default:false
    },
  },
  { versionKey: false }
);
module.exports = mongoose.model("notifications", notificationSchema);
