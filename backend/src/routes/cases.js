const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  getCases,
  getCaseById,
  createCase,
  updateCase,
  deleteCase,
  addDocument,
  addImportantDate,
  getCaseStats
} = require('../controllers/caseController');

// Todas las rutas requieren autenticación
router.use(verifyToken);

// Rutas principales
router.get('/', getCases);
router.get('/stats', getCaseStats);
router.get('/:id', getCaseById);
router.post('/', createCase);
router.put('/:id', updateCase);
router.delete('/:id', deleteCase);

// Rutas para funcionalidades adicionales
router.post('/:id/documents', addDocument);
router.post('/:id/important-dates', addImportantDate);

module.exports = router;