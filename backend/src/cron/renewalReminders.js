const User = require('../models/User');
const { sendRenewalReminderNotification } = require('../services/notificationService');
const { sendRenewalReminder } = require('../services/emailService');
const logger = require('../utils/logger');

const sendRenewalReminders = async () => {
  try {
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);

    const usersToRemind = await User.find({
      subscriptionStatus: 'active',
      plan: { $ne: 'free' },
      subscriptionEndDate: { $gte: new Date(), $lte: fiveDaysFromNow },
    });

    logger.info(`Enviando recordatorios a ${usersToRemind.length} usuarios`);

    const planPrices = { basic: 50, professional: 150, premium: 250 };

    for (const user of usersToRemind) {
      const amount = planPrices[user.plan] || 0;
      try {
        await sendRenewalReminderNotification(user, amount, user.subscriptionEndDate);
        await sendRenewalReminder(user, amount, user.subscriptionEndDate);
        logger.info(`Recordatorio enviado a ${user.email}`);
      } catch (error) {
        logger.error(`Error enviando recordatorio a ${user.email}:`, error);
      }
    }

    return usersToRemind.length;
  } catch (error) {
    logger.error('Error sending renewal reminders:', error);
    throw error;
  }
};

module.exports = { sendRenewalReminders };