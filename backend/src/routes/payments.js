const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { validatePayment } = require('../middleware/validation');
const {
  createSubscriptionCheckout,
  createOneTimePayment,
  stripeWebhook,
  getPaymentHistory,
  cancelSubscription,
} = require('../controllers/paymentController');

router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.use(verifyToken);

router.post('/create-subscription', createSubscriptionCheckout);
router.post('/one-time', validatePayment, createOneTimePayment);
router.get('/history', getPaymentHistory);
router.post('/cancel-subscription', cancelSubscription);

module.exports = router;

