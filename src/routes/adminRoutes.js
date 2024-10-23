import { Router } from "express";
import { getIncidents, getProfile, incidentStatusUpdate, loginAdmin } from "../controllers/adminController.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/profile").post(getProfile);
router.route("/get-incidents").get(getIncidents);
router.route("/status-update").put(incidentStatusUpdate);


export default router;
