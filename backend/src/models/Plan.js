const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['free', 'basic', 'professional', 'premium'],
    unique: true,
    required: true,
  },
  displayName: { type: String, required: true },
  description: String,
  priceMonthly: { type: Number, required: true },
  priceYearly: { type: Number, required: true },
  consultationLimit: { type: Number, required: true },
  casesLimit: { type: Number, required: true },
  storageLimitMB: { type: Number, required: true },
  aiModel: { type: String, enum: ['nano', 'mini', 'pro'], required: true },
  includesCertificates: { type: Boolean, default: false },
  diplomaDiscount: { type: Number, default: 0 },
  includesPaidBooks: { type: Boolean, default: false },
  supportLevel: { type: String, enum: ['standard', 'priority', 'vip'], default: 'standard' },
  features: [{ text: String, included: Boolean }],
  stripePriceIdMonthly: String,
  stripePriceIdYearly: String,
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
});

// Inicialización de planes por defecto
planSchema.statics.initDefaultPlans = async function() {
  try {
    const Plan = mongoose.model('Plan');
    
    const plans = [
      {
        name: 'free',
        displayName: 'Free',
        priceMonthly: 0,
        priceYearly: 0,
        consultationLimit: 3,
        casesLimit: 5,
        storageLimitMB: 50,
        aiModel: 'nano',
        features: [
          { text: '3 consultas IA por mes', included: true },
          { text: '5 expedientes activos', included: true },
        ],
      },
      {
        name: 'basic',
        displayName: 'Básico',
        priceMonthly: 50,
        priceYearly: 500,
        consultationLimit: 10,
        casesLimit: 50,
        storageLimitMB: 500,
        aiModel: 'nano',
        features: [
          { text: '10 consultas IA por mes', included: true },
          { text: '50 expedientes activos', included: true },
        ],
      },
      {
        name: 'professional',
        displayName: 'Profesional',
        priceMonthly: 150,
        priceYearly: 1500,
        consultationLimit: 999999,
        casesLimit: 999999,
        storageLimitMB: 5000,
        aiModel: 'mini',
        features: [
          { text: 'Consultas IA ilimitadas', included: true },
          { text: 'Expedientes ilimitados', included: true },
        ],
      },
      {
        name: 'premium',
        displayName: 'Premium',
        priceMonthly: 250,
        priceYearly: 2500,
        consultationLimit: 999999,
        casesLimit: 999999,
        storageLimitMB: 50000,
        aiModel: 'pro',
        features: [
          { text: 'Consultas IA ilimitadas', included: true },
          { text: 'Expedientes ilimitados', included: true },
        ],
      },
    ];

    for (const planData of plans) {
      const exists = await Plan.findOne({ name: planData.name });
      if (!exists) {
        await Plan.create(planData);
        console.log(`[IA Lex Mundi] Plan ${planData.name} creado`);
      }
    }
    console.log('[IA Lex Mundi] Planes inicializados correctamente');
  } catch (error) {
    console.error('[IA Lex Mundi] Error inicializando planes:', error.message);
  }
};

module.exports = mongoose.model('Plan', planSchema);