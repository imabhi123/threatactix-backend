import mongoose from "mongoose";
const PlanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: String,
    required: true,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  features: [
    {
      type: String,
      required: true
    }
  ],
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const Plan = mongoose.model("Plan", PlanSchema);
export default Plan;
