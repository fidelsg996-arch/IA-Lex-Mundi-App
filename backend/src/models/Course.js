const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
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
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  certificatePrice: {
    type: Number,
    default: 200,
  },
  includedInPlan: {
    type: String,
    enum: ['free', 'basic', 'professional', 'premium'],
    default: 'free',
  },
  instructor: {
    type: String,
    required: true,
  },
  instructorBio: String,
  instructorPhoto: String,
  coverUrl: String,
  modules: [
    {
      title: String,
      videoUrl: String,
      content: String,
      resourcesUrl: String,
      durationMinutes: Number,
      order: Number,
    },
  ],
  exam: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
      explanation: String,
    },
  ],
  passingScore: {
    type: Number,
    default: 70,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  enrolledCount: {
    type: Number,
    default: 0,
  },
  completedCount: {
    type: Number,
    default: 0,
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

courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ level: 1, isActive: 1 });
courseSchema.index({ includedInPlan: 1 });

courseSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

courseSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    durationHours: this.durationHours,
    level: this.level,
    certificatePrice: this.certificatePrice,
    includedInPlan: this.includedInPlan,
    instructor: this.instructor,
    instructorBio: this.instructorBio,
    coverUrl: this.coverUrl,
    modules: this.modules.map(m => ({
      title: m.title,
      durationMinutes: m.durationMinutes,
      order: m.order,
    })),
    enrolledCount: this.enrolledCount,
    rating: this.rating,
  };
};

module.exports = mongoose.model('Course', courseSchema);