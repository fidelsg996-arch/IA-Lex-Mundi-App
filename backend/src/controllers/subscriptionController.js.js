const User = require('../models/User');
const Plan = require('../models/Plan');

// Actualizar plan del usuario
const upgradePlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { plan } = req.body;

    // Validar que el plan existe
    const validPlans = ['free', 'basic', 'professional', 'premium'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({
        success: false,
        error: 'Plan inválido'
      });
    }

    // Obtener configuración del plan
    const planConfig = await Plan.findOne({ name: plan });
    
    // Actualizar usuario
    const updates = {
      plan: plan,
      subscriptionStatus: 'active',
      subscriptionStartDate: new Date()
    };

    // Si hay configuración del plan, actualizar límites
    if (planConfig) {
      updates.consultationLimit = planConfig.consultationLimit;
      updates.casesLimit = planConfig.casesLimit;
      updates.storageLimitMB = planConfig.storageLimitMB;
    } else {
      // Valores por defecto según plan
      const defaultLimits = {
        free: { consultationLimit: 3, casesLimit: 5, storageLimitMB: 50 },
        basic: { consultationLimit: 10, casesLimit: 50, storageLimitMB: 500 },
        professional: { consultationLimit: 999, casesLimit: 999, storageLimitMB: 5120 },
        premium: { consultationLimit: 999, casesLimit: 999, storageLimitMB: 51200 }
      };
      
      const limits = defaultLimits[plan] || defaultLimits.free;
      updates.consultationLimit = limits.consultationLimit;
      updates.casesLimit = limits.casesLimit;
      updates.storageLimitMB = limits.storageLimitMB;
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: `Plan actualizado a ${plan.toUpperCase()} correctamente`,
      user: user.toPublicJSON()
    });

  } catch (error) {
    console.error('Error al actualizar plan:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el plan'
    });
  }
};

// Obtener información del plan actual
const getCurrentPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const planConfig = await Plan.findOne({ name: user.plan });

    res.json({
      success: true,
      plan: {
        name: user.plan,
        consultationLimit: user.consultationLimit,
        consultationsUsed: user.consultationsUsedThisMonth || 0,
        casesLimit: user.casesLimit,
        storageLimitMB: user.storageLimitMB,
        storageUsedMB: user.storageUsedMB || 0,
        details: planConfig || null
      }
    });

  } catch (error) {
    console.error('Error al obtener plan:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener información del plan'
    });
  }
};

module.exports = {
  upgradePlan,
  getCurrentPlan
};