const mongoose = require('mongoose');

const documentoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  tipo: { type: String, enum: ['pdf', 'doc', 'txt', 'image'], default: 'pdf' },
  descripcion: String,
  url: String,
  fecha: { type: Date, default: Date.now }
});

const expedienteSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  titulo: { type: String, required: true },
  cliente: { type: String, required: true },
  materia: { type: String, required: true },
  abogado: String,
  descripcion: String,
  estado: { 
    type: String, 
    enum: ['activo', 'en_proceso', 'cerrado'], 
    default: 'activo' 
  },
  prioridad: { 
    type: String, 
    enum: ['alta', 'media', 'baja'], 
    default: 'media' 
  },
  juzgado: String,
  ciudad: String,
  documentos: [documentoSchema],
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fechaCreacion: { type: Date, default: Date.now },
  fechaActualizacion: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expediente', expedienteSchema);