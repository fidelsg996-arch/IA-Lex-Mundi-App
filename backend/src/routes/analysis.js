const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { checkConsultationQuota } = require('../middleware/planLimits');
const { validateAnalysis, validateId } = require('../middleware/validation');
const {
  createAnalysis,
  getUserAnalyses,
  getAnalysisById,
  deleteAnalysis,
} = require('../controllers/analysisController');

router.use(verifyToken);

router.get('/', getUserAnalyses);
router.get('/:id', validateId, getAnalysisById);
router.post('/', checkConsultationQuota, validateAnalysis, createAnalysis);
router.delete('/:id', validateId, deleteAnalysis);

module.exports = router;

