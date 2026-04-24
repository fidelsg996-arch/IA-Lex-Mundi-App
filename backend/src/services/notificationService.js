const Notification = require('../models/Notification');
const logger = require('../utils/logger');

const createInAppNotification = async (userId, type, title, message, data = {}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      data,
      deliveredVia: { inApp: true }
    });
    logger.info(`In-app notification created for user ${userId}: ${type}`);
    return notification;
  } catch (error) {
    logger.error('Error creating in-app notification:', error);
  }
};

const sendNotification = async (userId, type, title, message, data = {}, options = {}) => {
  const notification = await createInAppNotification(userId, type, title, message, data);
  return notification;
};

const markNotificationsAsRead = async (userId, notificationIds = null) => {
  const query = { user: userId, read: false };
  if (notificationIds && notificationIds.length) {
    query._id = { $in: notificationIds };
  }
  await Notification.updateMany(query, { read: true, readAt: Date.now() });
};

const getUserNotifications = async (userId, limit = 50, skip = 0) => {
  const notifications = await Notification.find({ user: userId })
    .sort({ sentAt: -1 })
    .skip(skip)
    .limit(limit);
  const unreadCount = await Notification.countDocuments({ user: userId, read: false });
  return { notifications, unreadCount };
};

const sendRenewalReminderNotification = async (user, amount, nextDate) => {
  const title = 'Recordatorio de Renovación';
  const message = `Tu suscripción se renovará automáticamente en 5 días. Monto: $${amount} MXN.`;
  await sendNotification(user._id, 'renewal_reminder', title, message, { amount, nextDate });
};

const sendAnalysisCompleteNotification = async (userId, analysisId, documentName) => {
  const title = 'Análisis Completado';
  const message = `El análisis de "${documentName}" ha sido completado.`;
  await sendNotification(userId, 'analysis_ready', title, message, { analysisId, documentName });
};

const sendCertificateIssuedNotification = async (userId, certificateTitle, certificateUrl) => {
  const title = 'Certificado Emitido';
  const message = `Tu certificado de "${certificateTitle}" está listo para descargar.`;
  await sendNotification(userId, 'certificate_issued', title, message, { certificateTitle, certificateUrl });
};

const sendPaymentSuccessNotification = async (userId, amount, concept) => {
  const title = 'Pago Recibido';
  const message = `Hemos recibido tu pago de $${amount} MXN por concepto de ${concept}.`;
  await sendNotification(userId, 'payment_confirmation', title, message, { amount, concept });
};

module.exports = {
  createInAppNotification,
  sendNotification,
  markNotificationsAsRead,
  getUserNotifications,
  sendRenewalReminderNotification,
  sendAnalysisCompleteNotification,
  sendCertificateIssuedNotification,
  sendPaymentSuccessNotification,
};