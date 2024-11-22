import razorpay from '../config/razorpayConfig.js';
import crypto from 'crypto';

// Create a Razorpay order
export const createOrder = async (req, res) => {
  const { amount, currency, receipt } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise
      currency: currency || 'INR',
      receipt: receipt || `receipt_${Date.now()}`,
    };

    console.log(options)

    const order = await razorpay.orders.create(options);
    res.status(200).json({ orderId: order.id, amount: options.amount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify Razorpay payment
export const verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  try {
    const hmac = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (hmac === razorpay_signature) {
      res.status(200).json({ message: 'Payment verified successfully!' });
    } else {
      res.status(400).json({ message: 'Payment verification failed!' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
