const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 Verificar token
const verifyToken = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token inválido' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado, sin token' });
  }
};

// 👑 Requiere rol
const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
  };
};

// 💰 Requiere plan
const requirePlan = (plan) => {
  return (req, res, next) => {
    if (!req.user || req.user.plan !== plan) {
      return res.status(403).json({ message: 'Requiere plan superior' });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  requireRole,
  requirePlan,
};