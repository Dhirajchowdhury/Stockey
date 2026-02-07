import mongoose from 'mongoose';

const stockPriceHistorySchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  open: {
    type: Number,
    required: true
  },
  high: {
    type: Number,
    required: true
  },
  low: {
    type: Number,
    required: true
  },
  close: {
    type: Number,
    required: true
  },
  volume: {
    type: Number,
    required: true
  },
  adjustedClose: {
    type: Number
  },
  interval: {
    type: String,
    enum: ['1min', '5min', '15min', '30min', '1hour', '1day', '1week', '1month'],
    default: '1day'
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
stockPriceHistorySchema.index({ symbol: 1, date: -1 });
stockPriceHistorySchema.index({ symbol: 1, interval: 1, date: -1 });

// Prevent duplicate entries
stockPriceHistorySchema.index({ symbol: 1, date: 1, interval: 1 }, { unique: true });

// Static method to get price history for a symbol
stockPriceHistorySchema.statics.getHistory = async function(symbol, days = 30, interval = '1day') {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    symbol: symbol.toUpperCase(),
    interval,
    date: { $gte: startDate }
  }).sort({ date: 1 }).lean();
};

// Static method to get latest price
stockPriceHistorySchema.statics.getLatestPrice = async function(symbol, interval = '1day') {
  return this.findOne({
    symbol: symbol.toUpperCase(),
    interval
  }).sort({ date: -1 }).lean();
};

const StockPriceHistory = mongoose.model('StockPriceHistory', stockPriceHistorySchema);

export default StockPriceHistory;
