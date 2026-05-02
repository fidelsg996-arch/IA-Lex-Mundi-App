const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  concept: {
    type: String,
    enum: ['monthly_subscription', 'yearly_subscription', 'course_certificate', 'diploma', 'book', 'extra_consultations'],
    required: true,
    index: true,
  },
  referenceId: String,
  paymentMethod: {
    type: String,
    enum: ['card', 'oxxo', 'transfer', 'stripe'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'expired'],
    default: 'pending',
    index: true,
  },
  paymentDate: Date,
  expirationDate: Date,
  oxxoReference: String,
  stripePaymentIntentId: String,
  stripeSubscriptionId: String,
  invoiceUrl: String,
  invoiceFolio: String,
  invoiceUuid: String,
  metadata: {
    plan: String,
    period: String,
    description: String,
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

paymentSchema.index({ user: 1, status: 1, createdAt: -1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ invoiceFolio: 1 });

paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

paymentSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    amount: this.amount,
    concept: this.concept,
    referenceId: this.referenceId,
    paymentMethod: this.paymentMethod,
    status: this.status,
    paymentDate: this.paymentDate,
    invoiceUrl: this.invoiceUrl,
    invoiceFolio: this.invoiceFolio,
    metadata: this.metadata,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('Payment', paymentSchema);