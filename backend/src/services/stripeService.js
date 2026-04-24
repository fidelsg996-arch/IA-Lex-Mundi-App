const Stripe = require('stripe');

let stripe = null;

const getStripeClient = () => {
  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
      maxNetworkRetries: 3,
    });
  }
  return stripe;
};

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
  const client = getStripeClient();
  return await client.customers.create({
    email,
    name,
    metadata: { app: 'IA Lex Mundi International Law', ...metadata },
  });
};

const createSubscription = async (customerId, priceId) => {
  const client = getStripeClient();
  return await client.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
};

const cancelSubscription = async (subscriptionId) => {
  const client = getStripeClient();
  return await client.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
};

const resumeSubscription = async (subscriptionId) => {
  const client = getStripeClient();
  return await client.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
};

const createCheckoutSession = async (customerId, priceId, successUrl, cancelUrl) => {
  const client = getStripeClient();
  return await client.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { app: 'IA Lex Mundi International Law' },
  });
};

const createOneTimePaymentIntent = async (amount, currency = 'mxn', metadata = {}) => {
  const client = getStripeClient();
  return await client.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata: { app: 'IA Lex Mundi International Law', ...metadata },
    automatic_payment_methods: { enabled: true },
  });
};

const getSubscription = async (subscriptionId) => {
  const client = getStripeClient();
  return await client.subscriptions.retrieve(subscriptionId);
};

const getInvoice = async (invoiceId) => {
  const client = getStripeClient();
  return await client.invoices.retrieve(invoiceId);
};

const handleWebhook = async (payload, signature) => {
  const client = getStripeClient();
  return client.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
};

module.exports = {
  getStripeClient,
  PRICE_IDS,
  createCustomer,
  createSubscription,
  cancelSubscription,
  resumeSubscription,
  createCheckoutSession,
  createOneTimePaymentIntent,
  getSubscription,
  getInvoice,
  handleWebhook,
};