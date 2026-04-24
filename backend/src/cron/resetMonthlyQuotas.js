const User = require('../models/User');
const logger = require('../utils/logger');

const resetAllMonthlyQuotas = async () => {
  try {
    const result = await User.updateMany(
      {},
      { $set: { consultationsUsedThisMonth: 0, lastQuotaReset: new Date() } }
    );
    logger.info(`Reset monthly quotas: ${result.modifiedCount} usuarios actualizados`);
    return result;
  } catch (error) {
    logger.error('Error resetting monthly quotas:', error);
    throw error;
  }
};

module.exports = { resetAllMonthlyQuotas };