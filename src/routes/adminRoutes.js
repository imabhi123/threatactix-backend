import { Router } from "express";
import { getAllUsers, getIncidents, getMalwareTableHeadings, getProfile, getTableHeadings, incidentStatusUpdate, loginAdmin, updateMalwareTableHeading, updateTableHeading } from "../controllers/adminController.js";
import { updateMalwareRowData, updateRowData } from "../controllers/incidentController.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/profile").post(getProfile);
router.route("/get-incidents").get(getIncidents);
router.route("/status-update").put(incidentStatusUpdate);
router.route("/get-table-headings").post(getTableHeadings);
router.route("/get-malware-table-headings").post(getMalwareTableHeadings);
router.route('/update-table-heading').put(updateTableHeading);
router.route('/update-malware-table-heading').put(updateMalwareTableHeading);
router.route('/update-rowdata').put(updateRowData);
router.route('/update-malware-rowdata').put(updateMalwareRowData);
router.route('/get-all-users').get(getAllUsers);

export default router;
