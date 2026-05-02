const express = require('express');
const router = express.Router();

// Modelo temporal (mientras se crea el modelo real)
let torneosDB = [];

// Obtener todos los torneos
router.get('/', (req, res) => {
  res.json({ success: true, data: torneosDB });
});

// Guardar resultado de duelo
router.post('/resultado', (req, res) => {
  const { litigante1, litigante2, ganador, puntos1, puntos2 } = req.body;
  
  console.log('📊 Resultado recibido:', req.body);
  
  // Guardar en "base de datos" temporal
  const duelo = {
    id: Date.now(),
    fecha: new Date(),
    litigante1,
    litigante2,
    ganador,
    puntos1,
    puntos2,
    timestamp: Date.now()
  };
  
  torneosDB.push(duelo);
  
  res.json({ 
    success: true, 
    message: 'Resultado guardado',
    duelo 
  });
});

// Obtener historial de duelos
router.get('/historial', (req, res) => {
  res.json({ success: true, data: torneosDB });
});

// Reiniciar torneo
router.post('/reiniciar', (req, res) => {
  torneosDB = [];
  res.json({ success: true, message: 'Torneo reiniciado' });
});

module.exports = router;
