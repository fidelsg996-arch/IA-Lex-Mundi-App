const mongoose = require('mongoose');

const LeySchema = new mongoose.Schema({
    leyId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    nombre: {
        type: String,
        required: true
    },
    contenido: {
        type: String,
        required: true
    },
    fuente: {
        type: String,
        enum: ['camaraDiputados', 'dof'],
        default: 'camaraDiputados'
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    },
    version: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
});

// Índices para búsqueda
LeySchema.index({ nombre: 'text', contenido: 'text' });

module.exports = mongoose.model('Ley', LeySchema);
