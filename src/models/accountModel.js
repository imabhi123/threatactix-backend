const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const account_Schema = new Schema(
  {
    USER_ID: {
      type: String,
      required: true,
    },
    PASSWORD: {
      type: String,
      required: true,
    },
    ROLE : {
      type:String,
      required:true,
      default:"USER"
    },
    TEAM_ID : {
      type:String,
      default:""
    }
  },
  { versionKey: false }
);
module.exports = mongoose.model("user_account", account_Schema);
