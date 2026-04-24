const User = require('../models/User');
const { uploadFile, deleteFile } = require('../services/storageService');
const { validateFIEL } = require('../services/fielService');
const { getUserNotifications, markNotificationsAsRead } = require('../services/notificationService');
const logger = require('../utils/logger');

const getProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user.toPublicJSON(),
      subscription: {
        plan: req.user.plan,
        status: req.user.subscriptionStatus,
        startDate: req.user.subscriptionStartDate,
        endDate: req.user.subscriptionEndDate,
        isActive: req.user.isSubscriptionActive(),
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, rfc, businessName, taxRegime, taxAddress, emailNotifications, pushNotifications, language, theme } = req.body;
    const userId = req.user._id;

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (rfc) updates.rfc = rfc.toUpperCase();
    if (businessName) updates.businessName = businessName;
    if (taxRegime) updates.taxRegime = taxRegime;
    if (taxAddress) updates.taxAddress = taxAddress;
    if (emailNotifications !== undefined) updates.emailNotifications = emailNotifications;
    if (pushNotifications !== undefined) updates.pushNotifications = pushNotifications;
    if (language) updates.language = language;
    if (theme) updates.theme = theme;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const uploadFIEL = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { cerFile, keyFile, password } = req.body;

    if (!cerFile || !keyFile) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren los archivos .cer y .key',
      });
    }

    const cerUpload = await uploadFile(
      Buffer.from(cerFile.data, 'base64'),
      `${userId}_certificado.cer`,
      'application/x-x509-ca-cert',
      'fiel'
    );

    const keyUpload = await uploadFile(
      Buffer.from(keyFile.data, 'base64'),
      `${userId}_llave.key`,
      'application/x-pkcs12',
      'fiel'
    );

    const isValid = await validateFIEL(cerUpload.url, null);

    await User.findByIdAndUpdate(userId, {
      fielCerUrl: cerUpload.url,
      fielKeyUrl: keyUpload.url,
      fielValidated: isValid,
      fielExpirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      message: isValid ? 'FIEL cargada y validada correctamente' : 'FIEL cargada pero no pudo ser validada',
      validated: isValid,
    });
  } catch (error) {
    logger.error('Error uploading FIEL:', error);
    next(error);
  }
};

const deleteFIEL = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (user.fielCerUrl) await deleteFile(user.fielCerUrl);
    if (user.fielKeyUrl) await deleteFile(user.fielKeyUrl);

    await User.findByIdAndUpdate(userId, {
      fielCerUrl: null,
      fielKeyUrl: null,
      fielValidated: false,
      fielExpirationDate: null,
    });

    res.json({
      success: true,
      message: 'FIEL eliminada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

const getUserStats = async (req, res, next) => {
  try {
    res.json({
      success: true,
      stats: {
        plan: req.user.plan,
        consultationsUsed: req.user.consultationsUsedThisMonth,
        consultationLimit: req.user.consultationLimit,
        casesLimit: req.user.casesLimit,
        storageUsedMB: req.user.storageUsedMB,
        storageLimitMB: req.user.storageLimitMB,
        totalAnalyses: req.user.totalAnalyses,
        totalQuizzes: req.user.totalQuizzes,
        totalDocuments: req.user.totalDocuments,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserNotificationsCtrl = async (req, res, next) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const { notifications, unreadCount } = await getUserNotifications(
      req.user._id,
      parseInt(limit),
      parseInt(skip)
    );
    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

const markNotificationsReadCtrl = async (req, res, next) => {
  try {
    const { notificationIds } = req.body;
    await markNotificationsAsRead(req.user._id, notificationIds);
    res.json({
      success: true,
      message: 'Notificaciones marcadas como leídas',
    });
  } catch (error) {
    next(error);
  }
};

// NUEVA FUNCIÓN: Cambiar contraseña
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;

    // Verificar que se enviaron los campos
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren la contraseña actual y la nueva contraseña',
      });
    }

    // Verificar contraseña actual
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'La contraseña actual es incorrecta',
      });
    }

    // Verificar que la nueva contraseña sea diferente
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        error: 'La nueva contraseña debe ser diferente a la actual',
      });
    }

    // Verificar longitud mínima
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La nueva contraseña debe tener al menos 6 caracteres',
      });
    }

    // Actualizar contraseña
    user.password = newPassword;
    await user.save();

    logger.info(`Contraseña actualizada para usuario: ${user.email}`);

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  uploadFIEL,
  deleteFIEL,
  getUserStats,
  getUserNotifications: getUserNotificationsCtrl,
  markNotificationsRead: markNotificationsReadCtrl,
  changePassword,
};