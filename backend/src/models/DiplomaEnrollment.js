const mongoose = require('mongoose');

const diplomaEnrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  diploma: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Diploma',
    required: true,
    index: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now,
  },
  completionDate: Date,
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Canceled'],
    default: 'Active',
    index: true,
  },
  grade: Number,
  certificateUrl: String,
  fielSigned: {
    type: Boolean,
    default: false,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
  },
  amountPaid: Number,
});

diplomaEnrollmentSchema.index({ user: 1, diploma: 1 }, { unique: true });
diplomaEnrollmentSchema.index({ status: 1 });

diplomaEnrollmentSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    diplomaId: this.diploma,
    enrollmentDate: this.enrollmentDate,
    completionDate: this.completionDate,
    status: this.status,
    grade: this.grade,
    certificateUrl: this.certificateUrl,
    fielSigned: this.fielSigned,
  };
};

module.exports = mongoose.model('DiplomaEnrollment', diplomaEnrollmentSchema);