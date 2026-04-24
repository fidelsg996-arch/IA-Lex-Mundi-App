const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: function() { return !this.googleId; },
    select: false,
  },
  googleId: {
    type: String,
    sparse: true,
    index: true,
  },
  profilePicture: String,
  
  // Datos personales adicionales
  phone: { type: String, trim: true },
  specialty: { type: String, trim: true },  // Especialidad legal / área de interés
  
  // Datos fiscales
  rfc: {
    type: String,
    uppercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/.test(v);
      },
      message: 'RFC inválido',
    },
  },
  businessName: { type: String, trim: true },
  taxRegime: {
    type: String,
    enum: ['G01', 'G02', 'G03', 'G04', 'G05', 'G06', 'G07', 'G08', 'G09', 'G10', 'G11', 'G12'],
    default: 'G01',
  },
  taxAddress: {
    street: String,
    number: String,
    interior: String,
    colony: String,
    city: String,
    state: String,
    zipCode: String,
  },
  
  // Suscripción
  plan: {
    type: String,
    enum: ['free', 'basic', 'professional', 'premium'],
    default: 'free',
    index: true,
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'expired', 'trialing'],
    default: 'active',
  },
  subscriptionStartDate: { type: Date, default: Date.now },
  subscriptionEndDate: Date,
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  
  // Límites y uso
  consultationsUsedThisMonth: { type: Number, default: 0 },
  consultationLimit: { type: Number, default: 3 },
  casesLimit: { type: Number, default: 5 },
  storageUsedMB: { type: Number, default: 0 },
  storageLimitMB: { type: Number, default: 50 },
  lastQuotaReset: { type: Date, default: Date.now },
  
  // FIEL del SAT
  fielCerUrl: String,
  fielKeyUrl: String,
  fielExpirationDate: Date,
  fielValidated: { type: Boolean, default: false },
  
  // Preferencias
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: true },
  language: { type: String, enum: ['es', 'en'], default: 'es' },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  
  // Seguridad
  emailVerified: { type: Boolean, default: false },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  lastLoginIP: String,
  
  // Estadísticas
  totalAnalyses: { type: Number, default: 0 },
  totalQuizzes: { type: Number, default: 0 },
  totalDocuments: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.index({ email: 1, plan: 1 });
userSchema.index({ stripeCustomerId: 1 });

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.hasConsultationQuota = function() {
  return this.consultationsUsedThisMonth < this.consultationLimit;
};

userSchema.methods.hasCasesQuota = async function(activeCasesCount) {
  return activeCasesCount < this.casesLimit;
};

userSchema.methods.consumeConsultation = async function() {
  if (!this.hasConsultationQuota()) {
    throw new Error('Límite de consultas alcanzado');
  }
  this.consultationsUsedThisMonth += 1;
  this.totalAnalyses += 1;
  await this.save();
  return this.consultationsUsedThisMonth;
};

userSchema.methods.resetMonthlyQuotas = async function() {
  this.consultationsUsedThisMonth = 0;
  this.lastQuotaReset = Date.now();
  await this.save();
};

userSchema.methods.updateLimitsByPlan = async function() {
  const Plan = mongoose.model('Plan');
  const planConfig = await Plan.findOne({ name: this.plan });
  if (planConfig) {
    this.consultationLimit = planConfig.consultationLimit;
    this.casesLimit = planConfig.casesLimit;
    this.storageLimitMB = planConfig.storageLimitMB;
    await this.save();
  }
  return this;
};

userSchema.methods.generateEmailVerificationToken = function() {
  this.emailVerificationToken = crypto.randomBytes(32).toString('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
  return this.emailVerificationToken;
};

userSchema.methods.generatePasswordResetToken = function() {
  this.passwordResetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetExpires = Date.now() + 1 * 60 * 60 * 1000;
  return this.passwordResetToken;
};

userSchema.methods.isSubscriptionActive = function() {
  if (this.plan === 'free') return true;
  if (this.subscriptionStatus !== 'active') return false;
  if (this.subscriptionEndDate && this.subscriptionEndDate < new Date()) return false;
  return true;
};

userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    specialty: this.specialty,
    profilePicture: this.profilePicture,
    plan: this.plan,
    subscriptionStatus: this.subscriptionStatus,
    consultationLimit: this.consultationLimit,
    consultationsUsedThisMonth: this.consultationsUsedThisMonth,
    casesLimit: this.casesLimit,
    storageUsedMB: this.storageUsedMB,
    storageLimitMB: this.storageLimitMB,
    emailVerified: this.emailVerified,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);