import express from 'express';
import incidentController from '../controllers/incidentController.js';

const router = express.Router();

router.post('/incidents', incidentController.createIncident);
router.post('/incidents/getMostAffectedCountries', incidentController.getMostAffectedCountries);
router.post('/incidents/getMostActiveThreatActors', incidentController.getMostActiveThreatActors);
router.post('/incidents/getMostTargetedIndustries', incidentController.getMostTargetedIndustries);

router.get('/incidents', incidentController.getAllIncidents);
router.get('/incidents/:id', incidentController.getIncidentById);
router.put('/incidents/:id', incidentController.updateIncident);
router.delete('/incidents/:id', incidentController.deleteIncident);
router.get('/incidents/search', incidentController.searchIncidents);
router.post('/incidents/dates', incidentController.getIncidentsByDateRange);
router.post('/incidents/:id/images', incidentController.addImageToIncident);
router.delete('/incidents/:id/images/:imageId', incidentController.removeImageFromIncident);

export default router;
 