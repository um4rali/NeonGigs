import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

// Function to get or create Razorpay instance (lazy initialization)
let razorpayInstance = null;
function getRazorpay() {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      console.error('❌ RAZORPAY KEYS MISSING!');
      console.error('   Please add valid keys to your .env file');
      console.error('   Get them from: https://dashboard.razorpay.com/app/website-app-settings/api-keys');
      throw new Error('Razorpay keys are not configured');
    }
    
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    
    console.log('🔑 Razorpay initialized successfully');
    console.log('   Key ID:', process.env.RAZORPAY_KEY_ID.substring(0, 15) + '...');
  }
  return razorpayInstance;
}

// Create Order
router.post('/create-order', async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const { amount, currency, gigTitle, gigId } = req.body;

    console.log('📝 Creating Razorpay order:', { amount, currency, gigTitle, gigId });

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise (₹1 = 100 paise)
      currency: currency || 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        gigTitle: gigTitle,
        gigId: gigId
      }
    };

    console.log('📦 Creating order with options:', options);

    const order = await razorpay.orders.create(options);

    console.log('✅ Order created successfully:', order.id);

    res.json({
      success: true,
      order: order,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error('❌ Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order. Please check your Razorpay API keys.',
      error: error.message
    });
  }
});

// Verify Payment Signature
router.post('/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      gigId,
      gigTitle,
      amount,
      userId
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Here you can save the order to database
      console.log('✅ Payment verified successfully');
      console.log('Payment ID:', razorpay_payment_id);
      console.log('Order ID:', razorpay_order_id);
      console.log('Gig ID:', gigId);
      console.log('User ID:', userId);

      // TODO: Save order to database
      // const order = await Order.create({
      //   userId,
      //   gigId,
      //   gigTitle,
      //   amount,
      //   paymentId: razorpay_payment_id,
      //   orderId: razorpay_order_id,
      //   status: 'paid'
      // });

      res.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });

    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid signature. Payment verification failed.'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
});

// Get Payment Details (optional)
router.get('/payment/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      payment: payment
    });

  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment details',
      error: error.message
    });
  }
});

export default router;
