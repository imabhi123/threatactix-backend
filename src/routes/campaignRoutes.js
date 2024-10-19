import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignsByTarget,
} from "../controllers/campaignController.js";

const router = express.Router();

router.post("/campaigns", createCampaign);
router.get("/campaigns", getAllCampaigns);
router.get("/campaigns/:id", getCampaignById);
router.put("/campaigns/:id", updateCampaign);
router.delete("/campaigns/:id", deleteCampaign);
router.get("/campaigns/target/:target", getCampaignsByTarget);

export default router;
