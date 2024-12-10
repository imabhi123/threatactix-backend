import { Router } from "express";
import { getAllUsers, getIncidents, getMalwareTableHeadings, getProfile, getTableHeadings, getVictimTableHeadings, incidentStatusUpdate, loginAdmin, signupAdmin, updateMalwareTableHeading, updateTableHeading, updateVictimTableHeading } from "../controllers/adminController.js";
import { updateMalwareRowData, updateRowData, updateVictimRowData } from "../controllers/incidentController.js";

const router = Router();

router.route("/login").post(loginAdmin);
router.route("/signup").post(signupAdmin);
router.route("/profile").post(getProfile);
router.route("/get-incidents").get(getIncidents);
router.route("/status-update").put(incidentStatusUpdate);
router.route("/get-table-headings").post(getTableHeadings);
router.route("/get-malware-table-headings").post(getMalwareTableHeadings);
router.route("/get-victim-table-headings").post(getVictimTableHeadings);
router.route('/update-table-heading').put(updateTableHeading);
router.route('/update-malware-table-heading').put(updateMalwareTableHeading);
router.route('/update-victim-table-heading').put(updateVictimTableHeading);
router.route('/update-rowdata').put(updateRowData);
router.route('/update-malware-rowdata').put(updateMalwareRowData);
router.route('/update-victim-rowdata').put(updateVictimRowData);
router.route('/get-all-users').get(getAllUsers);

export default router;
 