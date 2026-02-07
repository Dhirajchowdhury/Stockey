import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    default: 'application/pdf'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: ['quarterly-report', 'annual-report', 'analysis', 'research', 'whitepaper', 'other'],
    default: 'other'
  },
  relatedStocks: [{
    type: String,
    uppercase: true,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  accessLevel: {
    type: String,
    enum: ['free', 'basic', 'pro', 'elite'],
    default: 'free'
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
pdfSchema.index({ relatedStocks: 1 });
pdfSchema.index({ category: 1 });
pdfSchema.index({ accessLevel: 1 });
pdfSchema.index({ publishedAt: -1 });
pdfSchema.index({ title: 'text', description: 'text' });

// Static method to check if user can access PDF
pdfSchema.statics.canUserAccess = function(pdf, user) {
  if (!user) return pdf.accessLevel === 'free';
  
  const tierHierarchy = {
    'free': 0,
    'basic': 1,
    'pro': 2,
    'elite': 3
  };
  
  const userTier = user.subscription?.tier || 'free';
  return tierHierarchy[userTier] >= tierHierarchy[pdf.accessLevel];
};

// Method to increment downloads
pdfSchema.methods.incrementDownloads = async function() {
  this.downloads += 1;
  return this.save();
};

// Method to increment views
pdfSchema.methods.incrementViews = async function() {
  this.views += 1;
  return this.save();
};

const PDF = mongoose.model('PDF', pdfSchema);

export default PDF;
