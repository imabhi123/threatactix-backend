//backend/routes/paymentRoutes.js
import express from 'express';
import { createOrder, capturePayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createOrder);
router.post('/capture/:orderID', capturePayment);

export default router;