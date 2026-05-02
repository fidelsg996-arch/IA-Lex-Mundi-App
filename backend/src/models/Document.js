const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  case: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ['PDF', 'DOCX', 'JPG', 'PNG', 'TIFF'],
  },
  documentType: {
    type: String,
    enum: ['Demanda', 'Contestación', 'Sentencia', 'Contrato', 'Convenio', 'Promoción', 'Acuse', 'Poder', 'Otro'],
  },
  documentDate: Date,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  extractedText: String,
  ocrStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed'],
    default: 'Pending',
  },
  fileSizeBytes: Number,
  isFavorite: {
    type: Boolean,
    default: false,
  },
  metadata: {
    pages: Number,
    author: String,
    title: String,
  },
});

documentSchema.index({ user: 1, case: 1 });
documentSchema.index({ ocrStatus: 1 });

documentSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    fileName: this.fileName,
    fileUrl: this.fileUrl,
    fileType: this.fileType,
    documentType: this.documentType,
    documentDate: this.documentDate,
    uploadDate: this.uploadDate,
    extractedText: this.extractedText ? this.extractedText.substring(0, 500) + '...' : null,
    ocrStatus: this.ocrStatus,
    isFavorite: this.isFavorite,
  };
};

module.exports = mongoose.model('Document', documentSchema);