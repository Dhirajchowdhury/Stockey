import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: String,
    enum: ['basic', 'pro', 'elite'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'cancelled', 'expired', 'past_due'],
    default: 'inactive'
  },
  pricing: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    interval: {
      type: String,
      enum: ['month', 'year'],
      default: 'month'
    }
  },
  billing: {
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    stripePaymentMethodId: String,
    lastPaymentDate: Date,
    nextPaymentDate: Date
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    trialEnd: Date
  },
  features: {
    aiPredictions: {
      type: Boolean,
      default: false
    },
    advancedCharts: {
      type: Boolean,
      default: false
    },
    pdfAccess: {
      type: Boolean,
      default: false
    },
    apiAccess: {
      type: Boolean,
      default: false
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    customAlerts: {
      type: Boolean,
      default: false
    }
  },
  usage: {
    apiCalls: {
      type: Number,
      default: 0
    },
    predictionsGenerated: {
      type: Number,
      default: 0
    },
    pdfDownloads: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  cancelledAt: Date,
  cancelReason: String,
  autoRenew: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ 'period.endDate': 1 });
subscriptionSchema.index({ 'billing.stripeSubscriptionId': 1 });

// Static method to get active subscription for user
subscriptionSchema.statics.getActiveSubscription = async function(userId) {
  return this.findOne({
    user: userId,
    status: 'active',
    'period.endDate': { $gt: new Date() }
  }).lean();
};

// Method to check if subscription is active
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.period.endDate > new Date();
};

// Method to check if subscription is in trial
subscriptionSchema.methods.isInTrial = function() {
  return this.period.trialEnd && this.period.trialEnd > new Date();
};

// Method to cancel subscription
subscriptionSchema.methods.cancel = async function(reason) {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancelReason = reason;
  this.autoRenew = false;
  return this.save();
};

// Method to reset usage counters
subscriptionSchema.methods.resetUsage = async function() {
  this.usage.apiCalls = 0;
  this.usage.predictionsGenerated = 0;
  this.usage.pdfDownloads = 0;
  this.usage.lastResetDate = new Date();
  return this.save();
};

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
