const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { upgradePlan, getCurrentPlan } = require('../controllers/subscriptionController');

// Actualizar plan (requiere autenticación)
router.post('/upgrade', verifyToken, upgradePlan);

// Obtener plan actual (requiere autenticación)
router.get('/current', verifyToken, getCurrentPlan);

module.exports = router;


