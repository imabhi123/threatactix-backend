import mongoose from "mongoose";

// Define the Threat Actor schema
const ThreatActorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true, // e.g., "Ransomware", "Nation-State", "Hacktivist", etc.
  },
});

// Define the Victim schema
const VictimSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  site: {
    type: String,
    required: true, // The company's website URL
  },
});

// Define the main Incident schema
const IncidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    url: {
      type: String,
      required: true,
    },
    threatActor: ThreatActorSchema, // Embedded Threat Actor schema
    rawContent: {
      type: String,
      required: true, // This will store detailed content about the incident
    },
    publicationDate: {
      type: Date,
      required: true,
    },
    plannedPublicationDate: {
      type: Date, // Optional field if attackers plan to release info
    },
    category: {
      type: String,
      required: true, // e.g., "Ransomware", "Data Breach", "Malware", "Phishing", etc.
    },
    network: {
      type: String, // e.g., "TOR", "Surface Web", etc.
      required: true,
    },
    victims: [VictimSchema], // Array of victims affected by the incident
    images: [
      {
        description: String, // Description of the image
        url: String, // URL of the image (optional)
      },
    ],
  },
  { timestamps: true }
);

// Create and export the model
const Incident = mongoose.model("Incident", IncidentSchema);
export default Incident;
