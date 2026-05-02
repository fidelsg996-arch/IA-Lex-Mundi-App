const express = require('express');
const router = express.Router();
const Expediente = require('../models/Expediente');
const { verifyToken } = require('../middleware/auth');

// 🔐 TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN
router.use(verifyToken);

// ======================
// 📁 OBTENER TODOS LOS EXPEDIENTES
// ======================
router.get('/', async (req, res) => {
  try {
    console.log('📁 GET /api/expedientes - Usuario:', req.user._id);
    
    const expedientes = await Expediente.find({ usuario: req.user._id })
      .sort({ fechaCreacion: -1 });
    
    res.json({ 
      success: true, 
      data: expedientes,
      count: expedientes.length 
    });
  } catch (error) {
    console.error('Error al obtener expedientes:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ======================
// 📄 OBTENER EXPEDIENTE POR ID
// ======================
router.get('/:id', async (req, res) => {
  try {
    const expediente = await Expediente.findOne({ 
      _id: req.params.id, 
      usuario: req.user._id 
    });
    
    if (!expediente) {
      return res.status(404).json({ 
        success: false, 
        error: 'Expediente no encontrado' 
      });
    }
    
    res.json({ success: true, data: expediente });
  } catch (error) {
    console.error('Error al obtener expediente:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ======================
// ✨ CREAR NUEVO EXPEDIENTE
// ======================
router.post('/', async (req, res) => {
  try {
    console.log('📝 POST /api/expedientes - Usuario:', req.user._id);
    console.log('📦 Datos recibidos:', req.body);
    
    // Generar número automático si no viene
    let numero = req.body.numero;
    if (!numero) {
      const count = await Expediente.countDocuments({ usuario: req.user._id });
      const year = new Date().getFullYear();
      numero = `EXP-${year}-${(count + 1).toString().padStart(4, '0')}`;
    }
    
    // Crear expediente
    const expediente = new Expediente({
      numero: numero,
      titulo: req.body.titulo,
      cliente: req.body.cliente,
      materia: req.body.materia,
      abogado: req.body.abogado || req.user.name || '',
      descripcion: req.body.descripcion || '',
      estado: req.body.estado || 'activo',
      prioridad: req.body.prioridad || 'media',
      juzgado: req.body.juzgado || '',
      ciudad: req.body.ciudad || '',
      usuario: req.user._id
    });
    
    await expediente.save();
    
    console.log('✅ Expediente creado:', expediente._id);
    res.status(201).json({ 
      success: true, 
      data: expediente,
      message: 'Expediente creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al crear expediente:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ======================
// ✏️ ACTUALIZAR EXPEDIENTE
// ======================
router.put('/:id', async (req, res) => {
  try {
    const expediente = await Expediente.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user._id },
      { 
        ...req.body, 
        fechaActualizacion: Date.now() 
      },
      { new: true, runValidators: true }
    );
    
    if (!expediente) {
      return res.status(404).json({ 
        success: false, 
        error: 'Expediente no encontrado' 
      });
    }
    
    res.json({ 
      success: true, 
      data: expediente,
      message: 'Expediente actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar expediente:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ======================
// 🗑️ ELIMINAR EXPEDIENTE
// ======================
router.delete('/:id', async (req, res) => {
  try {
    const expediente = await Expediente.findOneAndDelete({ 
      _id: req.params.id, 
      usuario: req.user._id 
    });
    
    if (!expediente) {
      return res.status(404).json({ 
        success: false, 
        error: 'Expediente no encontrado' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Expediente eliminado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar expediente:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ======================
// 📎 AGREGAR DOCUMENTO
// ======================
router.post('/:id/documentos', async (req, res) => {
  try {
    const expediente = await Expediente.findOne({ 
      _id: req.params.id, 
      usuario: req.user._id 
    });
    
    if (!expediente) {
      return res.status(404).json({ 
        success: false, 
        error: 'Expediente no encontrado' 
      });
    }
    
    expediente.documentos.push({
      titulo: req.body.titulo,
      tipo: req.body.tipo || 'pdf',
      descripcion: req.body.descripcion || '',
      fecha: new Date()
    });
    
    await expediente.save();
    
    res.json({ 
      success: true, 
      data: expediente,
      message: 'Documento agregado exitosamente'
    });
  } catch (error) {
    console.error('Error al agregar documento:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ======================
// 🔄 CAMBIAR ESTADO
// ======================
router.patch('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    
    const expediente = await Expediente.findOneAndUpdate(
      { _id: req.params.id, usuario: req.user._id },
      { estado, fechaActualizacion: Date.now() },
      { new: true }
    );
    
    if (!expediente) {
      return res.status(404).json({ 
        success: false, 
        error: 'Expediente no encontrado' 
      });
    }
    
    res.json({ 
      success: true, 
      data: expediente,
      message: `Estado cambiado a: ${estado}`
    });
  } catch (error) {
    console.error('Error al cambiar estado:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ======================
// 📊 ESTADÍSTICAS DE EXPEDIENTES
// ======================
router.get('/estadisticas/resumen', async (req, res) => {
  try {
    const total = await Expediente.countDocuments({ usuario: req.user._id });
    const activos = await Expediente.countDocuments({ usuario: req.user._id, estado: 'activo' });
    const enProceso = await Expediente.countDocuments({ usuario: req.user._id, estado: 'en_proceso' });
    const cerrados = await Expediente.countDocuments({ usuario: req.user._id, estado: 'cerrado' });
    
    res.json({
      success: true,
      data: {
        total,
        activos,
        enProceso,
        cerrados
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;