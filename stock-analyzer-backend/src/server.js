// Load environment variables FIRST
import './config/env.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database.js';
import passport from './config/passport.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL_PROD 
    : process.env.FRONTEND_URL,
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Passport middleware
app.use(passport.initialize());

// Rate limiting
app.use(`/api/${process.env.API_VERSION || 'v1'}`, apiLimiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
import authRoutes from './routes/auth.routes.js';
import stockRoutes from './routes/stock.routes.js';
import newsRoutes from './routes/news.routes.js';
import blogRoutes from './routes/blog.routes.js';
import pdfRoutes from './routes/pdf.routes.js';
import predictionRoutes from './routes/prediction.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import userRoutes from './routes/user.routes.js';

const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/stocks`, stockRoutes);
app.use(`/api/${API_VERSION}/news`, newsRoutes);
app.use(`/api/${API_VERSION}/blogs`, blogRoutes);
app.use(`/api/${API_VERSION}/pdfs`, pdfRoutes);
app.use(`/api/${API_VERSION}/predictions`, predictionRoutes);
app.use(`/api/${API_VERSION}/subscriptions`, subscriptionRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Stock Analyzer Backend Server                       ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV?.padEnd(42)}║
║   Port: ${PORT.toString().padEnd(50)}║
║   API Version: ${API_VERSION.padEnd(45)}║
║                                                           ║
║   📊 Ready to analyze stocks with AI!                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

export default app;
