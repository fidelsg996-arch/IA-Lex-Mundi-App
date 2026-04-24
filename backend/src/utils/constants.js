module.exports = {
  APP_NAME: 'IA Lex Mundi International Law',
  APP_VERSION: '1.0.0',
  
  PLAN_LIMITS: {
    free: { consultationLimit: 3, casesLimit: 5, storageLimitMB: 50, aiModel: 'nano' },
    basic: { consultationLimit: 10, casesLimit: 50, storageLimitMB: 500, aiModel: 'nano' },
    professional: { consultationLimit: 999999, casesLimit: 999999, storageLimitMB: 5000, aiModel: 'mini' },
    premium: { consultationLimit: 999999, casesLimit: 999999, storageLimitMB: 50000, aiModel: 'pro' }
  },
  
  MATTERS: [
    'Civil', 'Penal', 'Laboral', 'Familiar', 'Mercantil',
    'Administrativo', 'Amparo', 'Constitucional', 'Fiscal',
    'Internacional', 'Derecho Humanos'
  ],
  
  DOCUMENT_TYPES: [
    'Demanda', 'Contestación', 'Sentencia', 'Contrato',
    'Convenio', 'Promoción', 'Acuse', 'Poder', 'Otro'
  ],
  
  AGENCIES: [
    'SAT', 'IMSS', 'INFONAVIT', 'CONAGUA', 'SEMARNAT',
    'SRE', 'SEP', 'SEDENA', 'PROFECO', 'CONDUSEF', 'RENAPO', 'Otro'
  ],
  
  SUBSCRIPTION_NOTICE_DAYS: 5,
  
  MESSAGES: {
    QUOTA_EXCEEDED: 'Has alcanzado tu límite de consultas IA para este mes. Actualiza tu plan para continuar.',
    INVALID_RFC: 'El RFC ingresado no es válido. Debe tener el formato estándar mexicano.',
    SUBSCRIPTION_CANCELLED: 'Tu suscripción ha sido cancelada. Seguirás disfrutando de los beneficios hasta el final del período pagado.',
    RENEWAL_REMINDER: 'Tu suscripción se renovará automáticamente en 5 días. El monto de {amount} será cargado a tu método de pago.',
  },
  
  SUBSCRIPTION_PLANS: {
    free: { name: 'Free', priceMonthly: 0, priceYearly: 0 },
    basic: { name: 'Básico', priceMonthly: 50, priceYearly: 500 },
    professional: { name: 'Profesional', priceMonthly: 150, priceYearly: 1500 },
    premium: { name: 'Premium', priceMonthly: 250, priceYearly: 2500 }
  }
};