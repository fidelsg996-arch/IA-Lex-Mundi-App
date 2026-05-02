const mongoose = require('mongoose');

const dueloSchema = new mongoose.Schema({
  torneo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Torneo',
    required: true
  },
  participante1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participante',
    required: true
  },
  participante2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participante',
    required: true
  },
  ganador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participante',
    default: null
  },
  tipo: {
    type: String,
    enum: ['clasificacion', 'grupo', 'eliminatoria'],
    required: true
  },
  fase: {
    type: String,
    enum: ['clasificacion', 'grupos', 'octavos', 'cuartos', 'semifinal', 'final'],
    default: 'clasificacion'
  },
  grupoId: {
    type: Number,
    default: null
  },
  llave: {
    type: String,
    enum: ['A', 'B', null],
    default: null
  },
  ordenDuelo: {
    type: Number,
    default: 0
  },
  puntajeParticipante1: {
    type: Number,
    default: 0
  },
  puntajeParticipante2: {
    type: Number,
    default: 0
  },
  completado: {
    type: Boolean,
    default: false
  },
  fechaDuelo: {
    type: Date,
    default: Date.now
  },
  preguntas: [{
    pregunta: String,
    opciones: [String],
    respuestaCorrecta: Number,
    respondioParticipante1: { type: Number, default: null },
    respondioParticipante2: { type: Number, default: null },
    turno: { type: String, enum: ['participante1', 'participante2'] }
  }]
}, {
  timestamps: true
});

// Índices para búsquedas rápidas
dueloSchema.index({ torneo: 1, tipo: 1 });
dueloSchema.index({ torneo: 1, grupoId: 1 });
dueloSchema.index({ torneo: 1, fase: 1 });
dueloSchema.index({ participante1: 1, participante2: 1 });

module.exports = mongoose.model('Duelo', dueloSchema);