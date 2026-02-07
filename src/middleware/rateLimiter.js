import rateLimit from 'express-rate-limit';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user && req.user.role === 'admin';
  }
});

// Strict rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts, please try again later',
      code: 'AUTH_RATE_LIMIT_EXCEEDED'
    }
  },
  skipSuccessfulRequests: true
});

// AI prediction rate limiter (more restrictive)
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 predictions per hour for free users
  message: {
    success: false,
    error: {
      message: 'AI prediction limit reached. Upgrade to premium for more predictions',
      code: 'AI_LIMIT_EXCEEDED'
    }
  },
  skip: (req) => {
    // Premium users get higher limits
    if (req.user) {
      const tier = req.user.subscription?.tier;
      return tier === 'pro' || tier === 'elite';
    }
    return false;
  }
});

// File upload rate limiter
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: {
      message: 'Too many file uploads, please try again later',
      code: 'UPLOAD_LIMIT_EXCEEDED'
    }
  }
});

// Search rate limiter
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  message: {
    success: false,
    error: {
      message: 'Too many search requests, please slow down',
      code: 'SEARCH_LIMIT_EXCEEDED'
    }
  }
});

export default {
  apiLimiter,
  authLimiter,
  aiLimiter,
  uploadLimiter,
  searchLimiter
};
