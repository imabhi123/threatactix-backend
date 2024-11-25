import { validationResult } from 'express-validator';
import Plan from '../models/planSchema.js';
import { User } from '../models/userModel.js';

export const getPlanPurchaseCounts = async (req, res) => {
  try {
    // Get all users with their plan details populated
    const users = await User.find({ "plan.planId": { $ne: null } }).populate("plan.planId", "name");

    // Count purchases for each plan
    const planCounts = users.reduce((acc, user) => {
      const planName = user.plan.planId?.name; // Access the name of the plan
      if (planName) {
        acc[planName] = (acc[planName] || 0) + 1;
      }
      return acc;
    }, {});

    // Convert the planCounts object to an array of objects
    const planStats = Object.entries(planCounts).map(([planName, count]) => ({
      planName,
      count,
    }));

    // Send the response
    res.status(200).json(planStats);
  } catch (error) {
    console.error("Error fetching plan purchase counts:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
};


// Create a new plan
export const createPlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, price, duration, features, discount, isActive } = req.body;

    const newPlan = new Plan({
      name,
      description,
      price,
      duration,
      features,
      discount,
      isActive
    });

    const savedPlan = await newPlan.save();
    res.status(201).json(savedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all plans
export const getAllPlans = async (req, res) => {
  try {
    // Sorting the plans by price in ascending order
    const plans = await Plan.find().sort({ price: 1 }); // Use -1 for descending order
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a single plan by ID
export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({data:plan});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a plan by ID
export const updatePlan = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedPlan = await Plan.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a plan by ID
export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlan = await Plan.findByIdAndDelete(id);

    if (!deletedPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
