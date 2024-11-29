import express from 'express';
import { sendOtp, sendPurchaseConfirmation, verifyOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/send-purchase-confirmation', sendPurchaseConfirmation);


export default router;
