const express = require('express');
const router = express.Router();
const torneoController = require('../controllers/torneoController');
const { tempAuth } = require('../middleware/tempAuth');

// Usar middleware temporal para todas las rutas de torneos
router.use(tempAuth);

// ========== TORNEOS ==========
router.get('/', torneoController.obtenerTorneoActivo);
router.post('/registrar', torneoController.registrarParticipante);
router.post('/pagar-inscripcion', torneoController.pagarInscripcion);
router.get('/participante', torneoController.obtenerMiParticipante);
router.post('/recargar', torneoController.recargarSaldo);
router.get('/transacciones', torneoController.obtenerTransacciones);

// ========== DUELOS ==========
router.get('/buscar-rival', torneoController.buscarRival);
router.post('/iniciar-duelo', torneoController.iniciarDuelo);
router.post('/responder', torneoController.responderPregunta);
router.get('/duelo-activo', torneoController.obtenerDueloActivo);

// ========== GRUPOS ==========
router.post('/generar-grupos', torneoController.generarFaseGrupos);
router.get('/grupos', torneoController.obtenerGrupos);
router.get('/mi-grupo', torneoController.obtenerMiGrupo);

// ========== ELIMINATORIA ==========
router.post('/generar-eliminatoria', torneoController.generarEliminatoria);
router.get('/eliminatoria', torneoController.obtenerEliminatoria);

module.exports = router;