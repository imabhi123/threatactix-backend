import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

// Create order route
router.post('/create-order', createOrder);

// Verify payment route
router.post('/verify-payment', verifyPayment);

export default router;
