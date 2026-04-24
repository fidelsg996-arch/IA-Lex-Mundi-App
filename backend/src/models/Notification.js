const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: [
      'renewal_reminder',
      'payment_confirmation',
      'payment_failed',
      'analysis_ready',
      'quiz_ready',
      'certificate_issued',
      'course_completed',
      'diploma_completed',
      'welcome',
      'system_alert',
    ],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: mongoose.Schema.Types.Mixed,
  read: {
    type: Boolean,
    default: false,
    index: true,
  },
  deliveredVia: {
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true },
  },
  sentAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  readAt: Date,
});

notificationSchema.index({ user: 1, read: 1, sentAt: -1 });

notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  this.readAt = Date.now();
  await this.save();
};

notificationSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    type: this.type,
    title: this.title,
    message: this.message,
    data: this.data,
    read: this.read,
    sentAt: this.sentAt,
    readAt: this.readAt,
  };
};

module.exports = mongoose.model('Notification', notificationSchema);