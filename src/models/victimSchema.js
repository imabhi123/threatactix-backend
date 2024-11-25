import mongoose from "mongoose";

const IncidentSchema = new mongoose.Schema(
  {
    sheetName: { type: String, required: true, default: "Malware Data" }, // Optional, if you want to store the sheet's name
    uploadedAt: { type: Date, default: Date.now }, // Tracks upload time
    data: [
      {
        // Flexible storage for each row of the Excel sheet
        row: {
          type: Map,
          of: mongoose.Schema.Types.Mixed, // Allows any type of data for each field
        },
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
    headings:{
      type:[String],
      required:true
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Victim = mongoose.model("Victim", IncidentSchema);
export default Victim;
