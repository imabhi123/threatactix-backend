
// backend/controllers/paymentController.js
import paypal from '@paypal/checkout-server-sdk';
import paypalClient from '../config/paypal.js';

export const createOrder = async (req, res) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    const total = req.body.total;

    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total
          }
        }
      ]
    });

    const order = await paypalClient.execute(request);
    res.json({ orderID: order.result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const capturePayment = async (req, res) => {
  const orderID = req.params.orderID;
  
  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    const capture = await paypalClient.execute(request);
    
    res.json({ 
      success: true, 
      captureID: capture.result.purchase_units[0].payments.captures[0].id 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};