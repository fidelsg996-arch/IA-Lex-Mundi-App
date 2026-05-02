const { body, param, query, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = errors.array().map(err => ({
    field: err.path,
    message: err.msg,
  }));
  
  return res.status(400).json({
    success: false,
    error: 'Error de validación',
    details: extractedErrors,
  });
};

const validateRegister = [
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  validate,
];

const validateLogin = [
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  validate,
];

const validateCase = [
  body('name')
    .notEmpty().withMessage('El nombre del expediente es requerido')
    .isLength({ max: 200 }).withMessage('El nombre no puede exceder 200 caracteres'),
  body('matter')
    .isIn(['Civil', 'Penal', 'Laboral', 'Familiar', 'Mercantil', 'Administrativo', 'Amparo', 'Constitucional', 'Fiscal', 'Internacional', 'Derecho Humanos'])
    .withMessage('Materia inválida'),
  body('court')
    .optional()
    .isLength({ max: 200 }).withMessage('El juzgado no puede exceder 200 caracteres'),
  validate,
];

const validateAnalysis = [
  body('inputText')
    .notEmpty().withMessage('El texto a analizar es requerido')
    .isLength({ min: 10 }).withMessage('El texto debe tener al menos 10 caracteres'),
  body('analysisType')
    .isIn(['Contract', 'Lawsuit', 'Sentence', 'General'])
    .withMessage('Tipo de análisis inválido'),
  validate,
];

const validateQuiz = [
  body('text')
    .notEmpty().withMessage('El texto para generar el quiz es requerido'),
  body('numberOfQuestions')
    .optional()
    .isInt({ min: 1, max: 30 }).withMessage('El número de preguntas debe estar entre 1 y 30'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard']).withMessage('Dificultad inválida'),
  validate,
];

const validatePayment = [
  body('amount')
    .isFloat({ min: 0.01 }).withMessage('El monto debe ser mayor a 0'),
  body('concept')
    .isIn(['monthly_subscription', 'yearly_subscription', 'course_certificate', 'diploma', 'book'])
    .withMessage('Concepto de pago inválido'),
  body('paymentMethod')
    .isIn(['card', 'oxxo', 'transfer', 'stripe']).withMessage('Método de pago inválido'),
  validate,
];

const validateId = [
  param('id')
    .isMongoId().withMessage('ID inválido'),
  validate,
];

module.exports = {
  validate,
  validateRegister,
  validateLogin,
  validateCase,
  validateAnalysis,
  validateQuiz,
  validatePayment,
  validateId,
};