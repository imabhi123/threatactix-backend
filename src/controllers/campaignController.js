import { Campaign } from "../models/campaignModel.js";

// Create a new campaign
export const createCampaign = async (req, res) => {
  try {
    const { name, description, attacksCount, targets } = req.body;

    const newCampaign = new Campaign({
      name,
      description,
      attacksCount,
      targets,
    });

    const savedCampaign = await newCampaign.save();
    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: savedCampaign,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error creating campaign",
    });
  }
};

// Get all campaigns
export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json({
      success: true,
      message: "Campaigns fetched successfully",
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching campaigns",
    });
  }
};

// Get a campaign by ID
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign fetched successfully",
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching campaign",
    });
  }
};

// Update a campaign by ID
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, attacksCount, targets } = req.body;

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      { name, description, attacksCount, targets },
      { new: true, runValidators: true } // To return the updated document and apply validators
    );

    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign updated successfully",
      data: updatedCampaign,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Error updating campaign",
    });
  }
};

// Delete a campaign by ID
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await Campaign.findByIdAndDelete(id);

    if (!deletedCampaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaign deleted successfully",
      data: deletedCampaign,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting campaign",
    });
  }
};

// Get campaigns by target
export const getCampaignsByTarget = async (req, res) => {
  try {
    const { target } = req.params;
    const campaigns = await Campaign.find({ targets: target });

    if (campaigns.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No campaigns found for the specified target",
      });
    }

    res.status(200).json({
      success: true,
      message: "Campaigns fetched successfully",
      data: campaigns,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching campaigns by target",
    });
  }
};
