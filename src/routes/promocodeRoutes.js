import express from 'express';
import {
  createPromoCode,
  getAllPromoCodes,
  getPromoCodeById,
  updatePromoCode,
  deletePromoCode,
  applyPromoCode
} from '../controllers/promoCodeController.js';

const router = express.Router();

router.post('/promocodes', createPromoCode);
router.get('/promocodes', getAllPromoCodes);
router.get('/promocodes/:id', getPromoCodeById);
router.put('/promocodes/:id', updatePromoCode);
router.delete('/promocodes/:id', deletePromoCode);
router.post('/promocodes/apply', applyPromoCode);

export default router;
