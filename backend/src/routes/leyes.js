const express = require('express');
const router = express.Router();
const leyesService = require('../services/leyesService');
const { verifyToken } = require('../middleware/auth');

// Obtener todas las leyes disponibles
router.get('/', verifyToken, async (req, res) => {
    try {
        const leyes = await leyesService.obtenerTodasLeyes();
        res.json({
            success: true,
            leyes: leyes
        });
    } catch (error) {
        console.error('Error al obtener leyes:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener las leyes'
        });
    }
});

// Obtener una ley específica
router.get('/:leyId', verifyToken, async (req, res) => {
    try {
        const { leyId } = req.params;
        const ley = await leyesService.obtenerLey(leyId);
        
        res.json({
            success: true,
            ley: {
                id: ley.leyId,
                nombre: ley.nombre,
                contenido: ley.contenido,
                fechaActualizacion: ley.fechaActualizacion
            }
        });
    } catch (error) {
        console.error('Error al obtener ley:', error);
        res.status(404).json({
            success: false,
            error: 'Ley no encontrada'
        });
    }
});

module.exports = router;

