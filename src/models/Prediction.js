import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  predictions: {
    nextDay: {
      price: Number,
      change: Number,
      changePercent: Number,
      confidence: {
        type: Number,
        min: 0,
        max: 1
      },
      direction: {
        type: String,
        enum: ['up', 'down', 'neutral']
      }
    },
    nextWeek: {
      price: Number,
      change: Number,
      changePercent: Number,
      confidence: {
        type: Number,
        min: 0,
        max: 1
      },
      direction: {
        type: String,
        enum: ['up', 'down', 'neutral']
      }
    },
    nextMonth: {
      price: Number,
      change: Number,
      changePercent: Number,
      confidence: {
        type: Number,
        min: 0,
        max: 1
      },
      direction: {
        type: String,
        enum: ['up', 'down', 'neutral']
      }
    }
  },
  features: {
    historicalVolatility: Number,
    averageVolume: Number,
    priceMovingAverage: {
      ma7: Number,
      ma30: Number,
      ma90: Number
    },
    rsi: Number,
    macd: {
      value: Number,
      signal: Number,
      histogram: Number
    },
    sentimentScore: Number,
    newsImpact: Number
  },
  model: {
    type: {
      type: String,
      enum: ['lstm', 'prophet', 'arima', 'ensemble', 'llm'],
      required: true
    },
    version: String,
    accuracy: Number,
    trainingDate: Date
  },
  explanation: {
    summary: String,
    keyFactors: [String],
    risks: [String],
    opportunities: [String],
    llmGenerated: Boolean
  },
  metadata: {
    generatedAt: {
      type: Date,
      default: Date.now
    },
    expiresAt: {
      type: Date,
      required: true
    },
    processingTime: Number,
    dataPoints: Number
  },
  accessLevel: {
    type: String,
    enum: ['free', 'basic', 'pro', 'elite'],
    default: 'basic'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
predictionSchema.index({ symbol: 1, 'metadata.generatedAt': -1 });
predictionSchema.index({ 'metadata.expiresAt': 1 });
predictionSchema.index({ accessLevel: 1 });

// TTL index to auto-delete expired predictions
predictionSchema.index({ 'metadata.expiresAt': 1 }, { expireAfterSeconds: 0 });

// Static method to get latest prediction for a symbol
predictionSchema.statics.getLatest = async function(symbol) {
  return this.findOne({
    symbol: symbol.toUpperCase(),
    isActive: true,
    'metadata.expiresAt': { $gt: new Date() }
  }).sort({ 'metadata.generatedAt': -1 }).lean();
};

// Static method to check if prediction is stale
predictionSchema.methods.isStale = function() {
  return new Date() > this.metadata.expiresAt;
};

// Method to calculate overall confidence
predictionSchema.methods.getOverallConfidence = function() {
  const { nextDay, nextWeek, nextMonth } = this.predictions;
  const confidences = [
    nextDay?.confidence,
    nextWeek?.confidence,
    nextMonth?.confidence
  ].filter(c => c !== undefined);
  
  return confidences.length > 0
    ? confidences.reduce((a, b) => a + b, 0) / confidences.length
    : 0;
};

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
