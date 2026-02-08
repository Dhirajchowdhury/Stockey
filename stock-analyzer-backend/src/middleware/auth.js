import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Not authorized to access this route',
          code: 'UNAUTHORIZED'
        }
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');

      if (!req.user || !req.user.isActive) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'User not found or inactive',
            code: 'USER_NOT_FOUND'
          }
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Token is invalid or expired',
          code: 'INVALID_TOKEN'
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        message: 'Server error during authentication',
        code: 'SERVER_ERROR'
      }
    });
  }
};

// Check if user has specific role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Not authorized',
          code: 'UNAUTHORIZED'
        }
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          message: `User role '${req.user.role}' is not authorized to access this route`,
          code: 'FORBIDDEN'
        }
      });
    }

    next();
  };
};

// Check if user has premium subscription
export const requirePremium = (minTier = 'basic') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      });
    }

    const tierHierarchy = {
      'free': 0,
      'basic': 1,
      'pro': 2,
      'elite': 3
    };

    const userTier = req.user.subscription?.tier || 'free';
    const userTierLevel = tierHierarchy[userTier];
    const requiredTierLevel = tierHierarchy[minTier];

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({
        success: false,
        error: {
          message: `This feature requires ${minTier} subscription or higher`,
          code: 'PREMIUM_REQUIRED',
          requiredTier: minTier,
          currentTier: userTier
        }
      });
    }

    // Check if subscription is active
    if (userTier !== 'free' && req.user.subscription?.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Your subscription is not active',
          code: 'SUBSCRIPTION_INACTIVE'
        }
      });
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password -refreshToken');
      } catch (error) {
        // Token invalid, but continue without user
        req.user = null;
      }
    }

    next();
  } catch (error) {
    next();
  }
};

export default { protect, authorize, requirePremium, optionalAuth };
