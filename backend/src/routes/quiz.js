const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { checkConsultationQuota } = require('../middleware/planLimits');
const { validateQuiz, validateId } = require('../middleware/validation');
const {
  generateQuiz,
  submitQuiz,
  getUserQuizzes,
  getQuizById,
  deleteQuiz,
} = require('../controllers/quizController');

router.use(verifyToken);

router.get('/', getUserQuizzes);
router.get('/:id', validateId, getQuizById);
router.post('/generate', checkConsultationQuota, validateQuiz, generateQuiz);
router.post('/:id/submit', validateId, submitQuiz);
router.delete('/:id', validateId, deleteQuiz);

module.exports = router;

