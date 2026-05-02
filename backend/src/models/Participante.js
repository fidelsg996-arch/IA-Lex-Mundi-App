const mongoose = require('mongoose');

const participanteSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  torneo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Torneo',
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  saldo: {
    type: Number,
    default: 0
  },
  puntajeTotal: {
    type: Number,
    default: 1000
  },
  duelosGanados: {
    type: Number,
    default: 0
  },
  duelosPerdidos: {
    type: Number,
    default: 0
  },
  duelosGrupoGanados: {
    type: Number,
    default: 0
  },
  victoriasGrupo: {
    type: Number,
    default: 0
  },
  grupoId: {
    type: Number,
    default: null
  },
  grupoNombre: {
    type: String,
    default: null
  },
  posicionGrupo: {
    type: Number,
    default: null
  },
  clasificadoAEliminatoria: {
    type: Boolean,
    default: false
  },
  eliminado: {
    type: Boolean,
    default: false
  },
  inscrito: {
    type: Boolean,
    default: false
  },
  faseGruposGenerada: {
    type: Boolean,
    default: false
  },
  transacciones: [{
    monto: Number,
    fecha: Date,
    tipo: String,
    metodo: String
  }]
}, {
  timestamps: true
});

// Índice compuesto para evitar duplicados
participanteSchema.index({ usuario: 1, torneo: 1 }, { unique: true });

module.exports = mongoose.model('Participante', participanteSchema);