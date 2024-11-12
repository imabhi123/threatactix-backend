import { Router } from "express";
import { getAllUsers, getIncidents, getProfile, getTableHeadings, incidentStatusUpdate, loginAdmin, updateTableHeading } from "../controllers/adminController.js";
import { updateRowData } from "../controllers/incidentController.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/profile").post(getProfile);
router.route("/get-incidents").get(getIncidents);
router.route("/status-update").put(incidentStatusUpdate);
router.route("/get-table-headings").post(getTableHeadings);
router.route('/update-table-heading').put(updateTableHeading);
router.route('/update-rowdata').put(updateRowData);
router.route('/get-all-users').get(getAllUsers);

export default router;
