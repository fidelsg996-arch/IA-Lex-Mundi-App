const mongoose = require('mongoose');

const courseProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  },
  completedModules: [Number],
  percentageCompleted: {
    type: Number,
    default: 0,
  },
  examScore: Number,
  examPassed: {
    type: Boolean,
    default: false,
  },
  certificateObtained: {
    type: Boolean,
    default: false,
  },
  certificateUrl: String,
  certificateObtainedAt: Date,
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
  lastAccessedAt: {
    type: Date,
    default: Date.now,
  },
});

courseProgressSchema.index({ user: 1, course: 1 }, { unique: true });
courseProgressSchema.index({ certificateObtained: 1 });

courseProgressSchema.pre('save', function(next) {
  this.lastAccessedAt = Date.now();
  next();
});

courseProgressSchema.methods.toPublicJSON = function() {
  return {
    courseId: this.course,
    percentageCompleted: this.percentageCompleted,
    completedModules: this.completedModules,
    examScore: this.examScore,
    examPassed: this.examPassed,
    certificateObtained: this.certificateObtained,
    certificateUrl: this.certificateUrl,
    startedAt: this.startedAt,
    completedAt: this.completedAt,
  };
};

module.exports = mongoose.model('CourseProgress', courseProgressSchema);