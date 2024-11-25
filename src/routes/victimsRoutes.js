import express from 'express';
import incidentController from '../controllers/victimsController.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Move /incidents/search before /incidents/:id
router.get('/victims/search', incidentController.searchIncidents);
router.post('/victims-by-id', incidentController.getIncidentsById);

router.post('/victims', incidentController.createIncident);

router.post('/victims/create-by-fileupload', upload.single('file'), incidentController.createIncidentByUploadingFile);

router.post('/victimss/d/getMostAffectedCountries', incidentController.getMostAffectedCountries);
router.post('/victims/getMostActiveThreatActors', incidentController.getMostActiveThreatActors);
router.post('/victims/getMostTargetedIndustries', incidentController.getMostTargetedIndustries);

router.get('/victims', incidentController.getAllIncidents);

// Ensure /incidents/:id comes after /search
router.get('/victims/:id', incidentController.getIncidentById);
router.put('/victims/:id', incidentController.updateIncident);
router.delete('/victims/:id', incidentController.deleteIncident);

router.post('/victims/dates', incidentController.getIncidentsByDateRange);
router.patch('/victims/:id/toggle-status', incidentController.updateStatus);
router.post('/victims/:id/images', incidentController.addImageToIncident);
router.delete('/victims/:id/images/:imageId', incidentController.removeImageFromIncident);

export default router;
