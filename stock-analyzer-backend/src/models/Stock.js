import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  exchange: {
    type: String,
    trim: true
  },
  sector: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  previousClose: {
    type: Number
  },
  open: {
    type: Number
  },
  dayHigh: {
    type: Number
  },
  dayLow: {
    type: Number
  },
  volume: {
    type: Number
  },
  avgVolume: {
    type: Number
  },
  marketCap: {
    type: Number
  },
  peRatio: {
    type: Number
  },
  eps: {
    type: Number
  },
  dividendYield: {
    type: Number
  },
  fiftyTwoWeekHigh: {
    type: Number
  },
  fiftyTwoWeekLow: {
    type: Number
  },
  change: {
    type: Number
  },
  changePercent: {
    type: Number
  },
  companyInfo: {
    description: String,
    ceo: String,
    employees: Number,
    founded: Number,
    headquarters: String,
    website: String
  },
  peers: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
stockSchema.index({ symbol: 1 }, { unique: true });
stockSchema.index({ name: 'text' });
stockSchema.index({ sector: 1 });
stockSchema.index({ changePercent: -1 });
stockSchema.index({ volume: -1 });
stockSchema.index({ marketCap: -1 });

// Virtual for calculating if stock is gaining
stockSchema.virtual('isGaining').get(function() {
  return this.changePercent > 0;
});

// Method to check if data is stale (older than 15 minutes)
stockSchema.methods.isStale = function() {
  const fifteenMinutes = 15 * 60 * 1000;
  return Date.now() - this.lastUpdated.getTime() > fifteenMinutes;
};

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
