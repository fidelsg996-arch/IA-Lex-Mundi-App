const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true,
  },
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document',
    index: true,
  },
  analysisType: {
    type: String,
    enum: ['Contract', 'Lawsuit', 'Sentence', 'General'],
    required: true,
  },
  inputText: {
    type: String,
    required: true,
  },
  analysisDate: {
    type: Date,
    default: Date.now,
    index: true,
  },
  risks: [String],
  problematicClauses: [
    {
      clause: String,
      issue: String,
    },
  ],
  recommendations: [String],
  riskLevel: {
    type: Number,
    min: 1,
    max: 10,
  },
  legalBasis: [String],
  fullResponse: String,
  aiModelUsed: {
    type: String,
    enum: ['gpt-5.4-nano', 'gpt-5.4-mini', 'gpt-5.4'],
  },
  consumedCredit: {
    type: Boolean,
    default: true,
  },
});

analysisSchema.index({ user: 1, analysisDate: -1 });
analysisSchema.index({ case: 1, analysisDate: -1 });

analysisSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    analysisType: this.analysisType,
    analysisDate: this.analysisDate,
    risks: this.risks,
    problematicClauses: this.problematicClauses,
    recommendations: this.recommendations,
    riskLevel: this.riskLevel,
    legalBasis: this.legalBasis,
    aiModelUsed: this.aiModelUsed,
  };
};

module.exports = mongoose.model('Analysis', analysisSchema);