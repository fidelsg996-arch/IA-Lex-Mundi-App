const mongoose = require('mongoose');

const torneoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    default: "Lex Mundi Invitational 2024"
  },
  descripcion: {
    type: String,
    default: "Torneo de litigación jurídica"
  },
  premio: {
    type: String,
    default: "$50,000 MXN"
  },
  costoInscripcion: {
    type: Number,
    default: 10
  },
  logo: {
    type: String,
    default: "⚖️"
  },
  estado: {
    type: String,
    enum: ['registro', 'clasificacion', 'grupos', 'eliminatoria', 'finalizado'],
    default: 'registro'
  },
  maxParticipantes: {
    type: Number,
    default: 32
  },
  victoriasNecesarias: {
    type: Number,
    default: 3
  },
  derrotasPermitidas: {
    type: Number,
    default: 2
  },
  fechaInicio: {
    type: Date,
    default: Date.now
  },
  fechaFin: Date,
  ganador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Torneo', torneoSchema);