// import paypal from '@paypal/checkout-server-sdk';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// dotenv.config();

// const environment = process.env.NODE_ENV === 'production'
//   ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
//   : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);

// const client = new paypal.core.PayPalHttpClient(environment);

// export default client;

import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export default razorpay;