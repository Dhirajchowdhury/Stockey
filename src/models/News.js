import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true
  },
  source: {
    name: String,
    url: String
  },
  author: {
    type: String,
    trim: true
  },
  publishedAt: {
    type: Date,
    required: true,
    index: true
  },
  imageUrl: {
    type: String
  },
  relatedStocks: [{
    type: String,
    uppercase: true,
    trim: true
  }],
  sentiment: {
    score: {
      type: Number,
      min: -1,
      max: 1,
      default: 0
    },
    label: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      default: 'neutral'
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    analyzedAt: Date
  },
  category: {
    type: String,
    enum: ['market', 'company', 'earnings', 'merger', 'regulation', 'general'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ relatedStocks: 1 });
newsSchema.index({ 'sentiment.label': 1 });
newsSchema.index({ title: 'text', content: 'text' });

// Static method to get news for a stock
newsSchema.statics.getStockNews = async function(symbol, limit = 10) {
  return this.find({
    relatedStocks: symbol.toUpperCase(),
    isActive: true
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .lean();
};

// Static method to get recent news
newsSchema.statics.getRecentNews = async function(days = 7, limit = 50) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.find({
    publishedAt: { $gte: startDate },
    isActive: true
  })
  .sort({ publishedAt: -1 })
  .limit(limit)
  .lean();
};

const News = mongoose.model('News', newsSchema);

export default News;
