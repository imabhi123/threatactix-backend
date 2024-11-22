import Razorpay from 'razorpay';

console.log(process.env.RAZORPAY_KEY_ID,'key-id')
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;
