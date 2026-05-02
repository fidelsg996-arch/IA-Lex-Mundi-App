const User = require('../models/User');
const Plan = require('../models/Plan');
const logger = require('../utils/logger');

const expireSubscriptions = async () => {
  try {
    const expiredUsers = await User.find({
      subscriptionStatus: 'active',
      plan: { $ne: 'free' },
      subscriptionEndDate: { $lt: new Date() },
    });

    logger.info(`Expirando suscripciones de ${expiredUsers.length} usuarios`);

    const freePlan = await Plan.findOne({ name: 'free' });

    for (const user of expiredUsers) {
      user.plan = 'free';
      user.subscriptionStatus = 'expired';
      if (freePlan) {
        user.consultationLimit = freePlan.consultationLimit;
        user.casesLimit = freePlan.casesLimit;
        user.storageLimitMB = freePlan.storageLimitMB;
      }
      await user.save();
      logger.info(`Suscripción expirada para ${user.email}`);
    }

    return expiredUsers.length;
  } catch (error) {
    logger.error('Error expiring subscriptions:', error);
    throw error;
  }
};

module.exports = { expireSubscriptions };