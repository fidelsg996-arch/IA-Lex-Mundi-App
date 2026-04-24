const Case = require('../models/Case');

const checkConsultationQuota = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user.hasConsultationQuota()) {
      return res.status(429).json({
        success: false,
        error: 'Has alcanzado tu límite de consultas IA para este mes. Actualiza tu plan para continuar.',
        quotaUsed: user.consultationsUsedThisMonth,
        quotaLimit: user.consultationLimit,
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

const checkCasesQuota = async (req, res, next) => {
  try {
    const user = req.user;
    const activeCasesCount = await Case.countDocuments({
      user: user._id,
      status: 'Active',
    });
    
    if (!user.hasCasesQuota(activeCasesCount)) {
      return res.status(429).json({
        success: false,
        error: `Has alcanzado tu límite de expedientes activos (${user.casesLimit}). Elimina algunos o actualiza tu plan.`,
        casesUsed: activeCasesCount,
        casesLimit: user.casesLimit,
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

const checkStorageQuota = async (req, res, next) => {
  try {
    const user = req.user;
    const storageUsed = user.storageUsedMB;
    const storageLimit = user.storageLimitMB;
    
    if (storageUsed >= storageLimit) {
      return res.status(429).json({
        success: false,
        error: `Has alcanzado tu límite de almacenamiento (${storageLimit} MB). Libera espacio o actualiza tu plan.`,
        storageUsed,
        storageLimit,
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};

const checkPlanAccess = (requiredPlan) => {
  return (req, res, next) => {
    const userPlan = req.user.plan;
    const planLevels = { free: 0, basic: 1, professional: 2, premium: 3 };
    
    if (planLevels[userPlan] >= planLevels[requiredPlan]) {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: `Esta funcionalidad requiere el plan ${requiredPlan}. Actualiza tu plan para acceder.`,
      });
    }
  };
};

module.exports = {
  checkConsultationQuota,
  checkCasesQuota,
  checkStorageQuota,
  checkPlanAccess,
};