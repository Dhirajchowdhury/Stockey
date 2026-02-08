import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 500
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  relatedStocks: [{
    type: String,
    uppercase: true,
    trim: true
  }],
  category: {
    type: String,
    enum: ['market-analysis', 'trading', 'tech', 'finance', 'crypto', 'general'],
    default: 'general'
  },
  readTime: {
    type: Number,
    default: 5
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  }
}, {
  timestamps: true
});

// Indexes
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ relatedStocks: 1 });
blogSchema.index({ title: 'text', content: 'text', excerpt: 'text' });

// Generate slug from title before saving
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Auto-set publishedAt when status changes to published
blogSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// Static method to get published blogs
blogSchema.statics.getPublished = async function(filters = {}, limit = 20, skip = 0) {
  const query = { status: 'published', ...filters };
  return this.find(query)
    .populate('author', 'name avatar')
    .sort({ publishedAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
};

// Method to increment views
blogSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
