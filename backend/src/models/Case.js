const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  // Información básica
  title: {
    type: String,
    required: [true, 'El título del expediente es obligatorio'],
    trim: true,
    maxlength: [200, 'El título no puede exceder los 200 caracteres']
  },
  caseNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'El número de expediente no puede exceder los 50 caracteres'],
    index: true
  },
  
  // Datos judiciales
  court: {
    type: String,
    trim: true,
    maxlength: [150, 'El nombre del juzgado no puede exceder los 150 caracteres']
  },
  matter: {
    type: String,
    enum: ['civil', 'laboral', 'familiar', 'penal', 'mercantil', 'administrativo', 'amparo', 'constitucional', 'internacional', 'otro'],
    default: 'civil'
  },
  
  // Partes involucradas
  plaintiff: {
    type: String,
    trim: true,
    maxlength: [150, 'El nombre del demandante no puede exceder los 150 caracteres']
  },
  defendant: {
    type: String,
    trim: true,
    maxlength: [150, 'El nombre del demandado no puede exceder los 150 caracteres']
  },
  lawyer: {
    type: String,
    trim: true,
    maxlength: [100, 'El nombre del abogado no puede exceder los 100 caracteres']
  },
  
  // Estado y fechas
  status: {
    type: String,
    enum: ['activo', 'pendiente', 'urgente', 'cerrado'],
    default: 'activo',
    index: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  
  // Información financiera
  amount: {
    type: Number,
    min: 0,
    default: 0
  },
  
  // Descripciones
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'La descripción no puede exceder los 2000 caracteres']
  },
  observations: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las observaciones no pueden exceder los 1000 caracteres']
  },
  
  // Documentos asociados
  documents: [{
    name: String,
    url: String,
    type: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Fechas importantes (audiencias, términos, etc.)
  importantDates: [{
    title: String,
    date: Date,
    description: String,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  
  // Usuario propietario
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Auditoría
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para búsquedas
caseSchema.index({ user: 1, status: 1 });
caseSchema.index({ user: 1, matter: 1 });
caseSchema.index({ user: 1, caseNumber: 1 });

// Virtual: duración del caso (en días)
caseSchema.virtual('durationDays').get(function() {
  if (!this.startDate) return 0;
  const end = this.endDate || new Date();
  const diffTime = Math.abs(end - this.startDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual: nombre completo del caso para búsquedas
caseSchema.virtual('fullTitle').get(function() {
  let title = this.title || '';
  if (this.caseNumber) title += ` (${this.caseNumber})`;
  if (this.plaintiff && this.defendant) title += ` - ${this.plaintiff} vs ${this.defendant}`;
  return title;
});

// Middleware: actualizar updatedAt
caseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Middleware: si se cambia a cerrado, establecer fecha de cierre
caseSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'cerrado' && !this.endDate) {
    this.endDate = Date.now();
  }
  next();
});

// Método para agregar documento
caseSchema.methods.addDocument = function(name, url, type) {
  this.documents.push({ name, url, type });
  return this.save();
};

// Método para agregar fecha importante
caseSchema.methods.addImportantDate = function(title, date, description) {
  this.importantDates.push({ title, date, description });
  return this.save();
};

// Método para marcar fecha importante como completada
caseSchema.methods.completeImportantDate = function(dateId) {
  const date = this.importantDates.id(dateId);
  if (date) {
    date.isCompleted = true;
    return this.save();
  }
  return Promise.reject(new Error('Fecha importante no encontrada'));
};

// Método para obtener resumen del caso
caseSchema.methods.getSummary = function() {
  return {
    id: this._id,
    title: this.title,
    caseNumber: this.caseNumber,
    status: this.status,
    matter: this.matter,
    plaintiff: this.plaintiff,
    defendant: this.defendant,
    startDate: this.startDate,
    durationDays: this.durationDays,
    documentCount: this.documents.length
  };
};

// Método estático para contar casos por estado
caseSchema.statics.countByStatus = function(userId) {
  return this.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);
};

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;