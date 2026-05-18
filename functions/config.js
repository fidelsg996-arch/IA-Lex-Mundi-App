// Configuración para Firebase Functions
const getConfig = () => {
  // Llave secreta real de Stripe (producción)
  const STRIPE_SECRET_KEY = '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';
  
  // Temporal - Estos se actualizarán cuando configures los webhooks en Stripe
  const STRIPE_WEBHOOK_SECRET_PLATFORM = 'temporal';
  const STRIPE_WEBHOOK_SECRET_CONNECT = 'temporal';
  
  const APP_URL = 'https://ia-lex-mundi-90c11.web.app';
  
  return {
    STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET_PLATFORM,
    STRIPE_WEBHOOK_SECRET_CONNECT,
    APP_URL
  };
};

module.exports = { getConfig };