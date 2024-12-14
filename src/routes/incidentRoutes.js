import express from 'express';
import incidentController, { deleteMultipleIncidents } from '../controllers/incidentController.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Move /incidents/search before /incidents/:id
router.get('/incidents/search', incidentController.searchIncidents);
router.post('/incidents-by-id', incidentController.getIncidentsById);

router.post('/incidents', incidentController.createIncident);

router.post('/incidents/create-by-fileupload', upload.single('file'), incidentController.createIncidentByUploadingFile);

router.post('/incidentss/d/getMostAffectedCountries', incidentController.getMostAffectedCountries);
router.post('/incidents/getMostActiveThreatActors', incidentController.getMostActiveThreatActors);
router.post('/incidents/getMostTargetedIndustries', incidentController.getMostTargetedIndustries);

router.post('/incidentsss', incidentController.getAllIncidents);
router.get('/get-controller-count',incidentController.getUsersByActivity);
router.delete("/incidents-delete", deleteMultipleIncidents);
// Ensure /incidents/:id comes after /search
router.get('/incidents/:id', incidentController.getIncidentById);
router.put('/incidents/:id', incidentController.updateIncident);
router.delete('/incidents/:id', incidentController.deleteIncident);

router.post('/incidents/dates', incidentController.getIncidentsByDateRange);
router.patch('/incidents/:id/toggle-status', incidentController.updateStatus);
router.post('/incidents/:id/images', incidentController.addImageToIncident);
router.delete('/incidents/:id/images/:imageId', incidentController.removeImageFromIncident);

export default router;
