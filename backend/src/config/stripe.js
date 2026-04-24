const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-11-20.acacia',
  maxNetworkRetries: 3,
});

const PRICE_IDS = {
  free: null,
  basic_monthly: process.env.STRIPE_PRICE_BASIC,
  basic_yearly: process.env.STRIPE_PRICE_BASIC_YEARLY,
  professional_monthly: process.env.STRIPE_PRICE_PROFESSIONAL,
  professional_yearly: process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY,
  premium_monthly: process.env.STRIPE_PRICE_PREMIUM,
  premium_yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY,
};

const createCustomer = async (email, name, metadata = {}) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        app: 'IA Lex Mundi International Law',
        ...metadata,
      },
    });
    return customer;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw error;
  }
};

const createSubscription = async (customerId, priceId) => {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
};

const createCheckoutSession = async (customerId, priceId, successUrl, cancelUrl) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { app: 'IA Lex Mundi International Law' },
    });
    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

const createPaymentIntent = async (amount, currency = 'mxn', metadata = {}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata: { app: 'IA Lex Mundi International Law', ...metadata },
      automatic_payment_methods: { enabled: true },
    });
    return paymentIntent;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

module.exports = {
  stripe,
  PRICE_IDS,
  createCustomer,
  createSubscription,
  cancelSubscription,
  createCheckoutSession,
  createPaymentIntent,
};