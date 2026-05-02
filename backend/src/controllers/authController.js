const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Plan = require('../models/Plan');
const { sendWelcomeEmail, sendPasswordResetEmail } = require('../services/emailService');
const { sendNotification } = require('../services/notificationService');
const logger = require('../utils/logger');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, plan = 'free' } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado'
      });
    }

    const planConfig = await Plan.findOne({ name: plan });
    if (!planConfig) {
      return res.status(400).json({
        success: false,
        error: 'Plan inválido'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      plan,
      consultationLimit: planConfig.consultationLimit,
      casesLimit: planConfig.casesLimit,
      storageLimitMB: planConfig.storageLimitMB,
    });

    try {
      await sendWelcomeEmail(user);
    } catch (emailError) {
      logger.error('Error sending welcome email:', emailError);
    }

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    user.lastLogin = Date.now();
    user.lastLoginIP = req.ip;
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const googleAuth = async (req, res, next) => {
  try {
    const { email, name, googleId, profilePicture } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      const planConfig = await Plan.findOne({ name: 'free' });
      user = await User.create({
        name,
        email,
        googleId,
        profilePicture,
        emailVerified: true,
        plan: 'free',
        consultationLimit: planConfig.consultationLimit,
        casesLimit: planConfig.casesLimit,
        storageLimitMB: planConfig.storageLimitMB,
      });
      try {
        await sendWelcomeEmail(user);
      } catch (emailError) {
        logger.error('Error sending welcome email:', emailError);
      }
    } else if (!user.googleId) {
      user.googleId = googleId;
      if (!user.profilePicture) user.profilePicture = profilePicture;
      await user.save();
    }

    user.lastLogin = Date.now();
    await user.save();

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user.toPublicJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No existe una cuenta con ese email'
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (emailError) {
      logger.error('Error sending password reset email:', emailError);
      return res.status(500).json({
        success: false,
        error: 'Error al enviar el email de recuperación'
      });
    }

    res.json({
      success: true,
      message: 'Se ha enviado un email con instrucciones'
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Token inválido o expirado'
      });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Token inválido o expirado'
      });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verificado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Sesión cerrada correctamente'
  });
};

// Cambiar contraseña (usuario autenticado)
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Debes proporcionar la contraseña actual y la nueva contraseña'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'La contraseña actual es incorrecta'
      });
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña cambiada correctamente'
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil
const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { name, phone, specialty } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (specialty !== undefined) updates.specialty = specialty;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  getMe,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
  changePassword,
  updateProfile,
};