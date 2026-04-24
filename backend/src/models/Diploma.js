const mongoose = require('mongoose');

const diplomaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  description: String,
  durationHours: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  includedInPremium: {
    type: Boolean,
    default: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  instructorCredentials: String,
  instructorPhoto: String,
  curriculum: [
    {
      moduleName: String,
      description: String,
      durationHours: Number,
      order: Number,
    },
  ],
  coverUrl: String,
  startDate: Date,
  endDate: Date,
  capacity: Number,
  enrolled: {
    type: Number,
    default: 0,
  },
  includesFIELCertificate: {
    type: Boolean,
    default: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

diplomaSchema.index({ title: 'text', description: 'text' });
diplomaSchema.index({ isActive: 1, isFeatured: 1 });
diplomaSchema.index({ price: 1 });

diplomaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

diplomaSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    durationHours: this.durationHours,
    price: this.price,
    includedInPremium: this.includedInPremium,
    instructor: this.instructor,
    instructorCredentials: this.instructorCredentials,
    coverUrl: this.coverUrl,
    curriculum: this.curriculum,
    startDate: this.startDate,
    endDate: this.endDate,
    capacity: this.capacity,
    enrolled: this.enrolled,
    includesFIELCertificate: this.includesFIELCertificate,
    rating: this.rating,
  };
};

module.exports = mongoose.model('Diploma', diplomaSchema);