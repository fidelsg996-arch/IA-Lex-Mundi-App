const mongoose = require('mongoose');

const procedureSchema = new mongoose.Schema({
  agency: {
    type: String,
    enum: ['SAT', 'IMSS', 'INFONAVIT', 'CONAGUA', 'SEMARNAT', 'SRE', 'SEP', 'SEDENA', 'PROFECO', 'CONDUSEF', 'RENAPO', 'Otro'],
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  description: String,
  requirements: [String],
  steps: [String],
  cost: String,
  deadline: String,
  formats: [String],
  officialLink: String,
  targetAudience: {
    type: String,
    enum: ['Individuals', 'Businesses', 'Both'],
  },
  isRecurring: Boolean,
  category: String,
  tags: [String],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

procedureSchema.index({ name: 'text', description: 'text' });
procedureSchema.index({ agency: 1, isActive: 1 });

procedureSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    agency: this.agency,
    name: this.name,
    description: this.description,
    requirements: this.requirements,
    steps: this.steps,
    cost: this.cost,
    deadline: this.deadline,
    formats: this.formats,
    officialLink: this.officialLink,
    targetAudience: this.targetAudience,
    lastUpdated: this.lastUpdated,
  };
};

module.exports = mongoose.model('Procedure', procedureSchema);