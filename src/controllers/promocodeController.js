import PromoCode from "../models/promocodeSchema.js";
// Create a new promo code
export const createPromoCode = async (req, res) => {
  try {
    const promoCode = new PromoCode(req.body);
    await promoCode.save();
    res.status(201).json(promoCode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all promo codes
export const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find();
    res.status(200).json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single promo code by ID
export const getPromoCodeById = async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json(promoCode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a promo code
export const updatePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promoCode) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json(promoCode);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a promo code
export const deletePromoCode = async (req, res) => {
  try {
    const promoCode = await PromoCode.findByIdAndDelete(req.params.id);
    if (!promoCode) return res.status(404).json({ message: 'Promo code not found' });
    res.status(200).json({ message: 'Promo code deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply a promo code
export const applyPromoCode = async (req, res) => {
  try {
    const { code } = req.body;
    const promoCode = await PromoCode.findOne({ code });

    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }
    
    if (promoCode.status !== 'active') {
      return res.status(400).json({ message: 'Promo code is not active' });
    }
    
    if (promoCode.expiryDate < new Date()) {
      return res.status(400).json({ message: 'Promo code has expired' });
    }
    
    if (promoCode.usageLimit <= promoCode.usedCount) {
      return res.status(400).json({ message: 'Promo code usage limit has been reached' });
    }
    
    // Mark the promo code as used
    promoCode.usedCount += 1;
    await promoCode.save();

    res.status(200).json({
      message: 'Promo code applied successfully',
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
