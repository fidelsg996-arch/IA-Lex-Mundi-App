const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    index: true,
  },
  category: {
    type: String,
    enum: ['Civil', 'Penal', 'Laboral', 'Fiscal', 'Constitucional', 'Amparo', 'Comercial', 'Internacional', 'Procesal', 'Administrativo', 'Derechos Humanos'],
    index: true,
  },
  description: String,
  price: {
    type: Number,
    default: 0,
    index: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  coverUrl: String,
  publisher: String,
  isbn: String,
  publicationDate: Date,
  downloads: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  tags: [String],
  language: {
    type: String,
    default: 'es',
  },
});

bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);