const express = require('express');
const router = express.Router();

// ?? IMPORTANTE: usamos verifyToken (NO verifyToken)
const { verifyToken } = require('../middleware/auth');

const { validateRegister, validateLogin } = require('../middleware/validation');

const {
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
} = require('../controllers/authController');

// ?? Públicas
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);

// ?? Protegidas
router.get('/me', verifyToken, getMe);
router.post('/logout', verifyToken, logout);

// Perfil
router.put('/update', verifyToken, updateProfile);

// Password
router.post('/change-password', verifyToken, changePassword);

module.exports = router;

