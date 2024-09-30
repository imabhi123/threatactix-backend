const mongoose = require("mongoose");
const { v4 } = require("uuid");
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    STATE_NAME: {
      type: Boolean,
      default:true
    },
    URL:{
        type:String,
        default:""
    }
});

module.exports = mongoose.model("status", schema);
