const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`${err.message} - ${req.method} ${req.path} - IP: ${req.ip}`);
  
  if (err.stack && process.env.NODE_ENV === 'development') {
    logger.error(err.stack);
  }

  // Error de MongoDB duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      error: `El campo ${field} ya está en uso. Por favor utiliza otro valor.`
    });
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: errors
    });
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Token inválido. Por favor inicia sesión nuevamente.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expirado. Por favor inicia sesión nuevamente.'
    });
  }

  // Error de Stripe
  if (err.type && err.type === 'StripeError') {
    return res.status(402).json({
      success: false,
      error: err.message,
      code: err.code
    });
  }

  // Error de límite de consultas
  if (err.message === 'Límite de consultas alcanzado') {
    return res.status(429).json({
      success: false,
      error: err.message
    });
  }

  // Error por defecto
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };