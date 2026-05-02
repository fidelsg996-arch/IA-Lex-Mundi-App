const Payment = require('../models/Payment');
const User = require('../models/User');
const Plan = require('../models/Plan');
const { createCheckoutSession, createOneTimePaymentIntent, PRICE_IDS, handleWebhook: stripeWebhookHandler } = require('../services/stripeService');
const { sendPaymentSuccessNotification } = require('../services/notificationService');
const logger = require('../utils/logger');

const createSubscriptionCheckout = async (req, res, next) => {
  try {
    const { plan, period = 'monthly' } = req.body;
    const userId = req.user._id;

    const planConfig = await Plan.findOne({ name: plan });
    if (!planConfig) return res.status(400).json({ success: false, error: 'Plan inválido' });

    const priceKey = `${plan}_${period}`;
    const priceId = PRICE_IDS[priceKey];
    if (!priceId) return res.status(400).json({ success: false, error: 'Precio no configurado para este plan' });

    let customerId = req.user.stripeCustomerId;
    if (!customerId) {
      const { createCustomer } = require('../services/stripeService');
      const customer = await createCustomer(req.user.email, req.user.name);
      customerId = customer.id;
      await User.findByIdAndUpdate(userId, { stripeCustomerId: customerId });
    }

    const successUrl = `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL}/payment/cancel`;
    const session = await createCheckoutSession(customerId, priceId, successUrl, cancelUrl);

    res.json({ success: true, sessionUrl: session.url, sessionId: session.id });
  } catch (error) {
    logger.error('Error creating subscription checkout:', error);
    next(error);
  }
};

const createOneTimePayment = async (req, res, next) => {
  try {
    const { amount, concept, referenceId, description } = req.body;
    const userId = req.user._id;

    const paymentIntent = await createOneTimePaymentIntent(amount, 'mxn', { userId: userId.toString(), concept, referenceId, description });

    const payment = await Payment.create({
      user: userId,
      amount,
      concept,
      referenceId,
      paymentMethod: 'card',
      status: 'pending',
      stripePaymentIntentId: paymentIntent.id,
      metadata: { description },
    });

    res.json({ success: true, clientSecret: paymentIntent.client_secret, paymentId: payment._id });
  } catch (error) {
    logger.error('Error creating one-time payment:', error);
    next(error);
  }
};

const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = await stripeWebhookHandler(req.body, sig);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        const user = await User.findOne({ stripeCustomerId: customerId });
        if (user) {
          user.stripeSubscriptionId = subscriptionId;
          user.subscriptionStatus = 'active';
          user.subscriptionStartDate = new Date();
          user.subscriptionEndDate = new Date();
          user.subscriptionEndDate.setDate(user.subscriptionEndDate.getDate() + 30);
          await user.save();

          await Payment.create({
            user: user._id,
            amount: session.amount_total / 100,
            concept: 'monthly_subscription',
            paymentMethod: 'card',
            status: 'completed',
            paymentDate: new Date(),
            stripePaymentIntentId: session.payment_intent,
          });

          await sendPaymentSuccessNotification(user._id, session.amount_total / 100, 'suscripción mensual');
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const user = await User.findOne({ stripeSubscriptionId: subscription.id });
        if (user) {
          user.subscriptionStatus = 'canceled';
          await user.save();
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook error:', error);
    res.status(400).json({ error: error.message });
  }
};

const getPaymentHistory = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0 } = req.query;
    const userId = req.user._id;

    const payments = await Payment.find({ user: userId, status: 'completed' })
      .sort({ paymentDate: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const total = await Payment.countDocuments({ user: userId, status: 'completed' });

    res.json({
      success: true,
      payments: payments.map(p => ({ id: p._id, amount: p.amount, concept: p.concept, referenceId: p.referenceId, paymentDate: p.paymentDate, invoiceUrl: p.invoiceUrl, invoiceFolio: p.invoiceFolio })),
      pagination: { total, limit: parseInt(limit), skip: parseInt(skip), hasMore: skip + parseInt(limit) < total },
    });
  } catch (error) {
    next(error);
  }
};

const cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user.stripeSubscriptionId) {
      return res.status(400).json({ success: false, error: 'No tienes una suscripción activa' });
    }

    const { cancelSubscription: cancelStripeSubscription } = require('../services/stripeService');
    await cancelStripeSubscription(user.stripeSubscriptionId);
    user.subscriptionStatus = 'canceled';
    await user.save();

    res.json({ success: true, message: 'Suscripción cancelada. Seguirás disfrutando de los beneficios hasta el final del período.', endDate: user.subscriptionEndDate });
  } catch (error) {
    logger.error('Error canceling subscription:', error);
    next(error);
  }
};

module.exports = {
  createSubscriptionCheckout,
  createOneTimePayment,
  stripeWebhook,
  getPaymentHistory,
  cancelSubscription,
};