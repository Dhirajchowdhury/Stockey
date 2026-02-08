import Prediction from '../models/Prediction.js';
import aiPredictionService from '../services/aiPredictionService.js';

// @desc    Get AI prediction for a stock
// @route   GET /api/v1/predictions/:symbol
// @access  Private (Basic tier+)
export const getPrediction = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    // Get latest prediction
    let prediction = await Prediction.getLatest(symbol);

    // If no prediction or expired, generate new one
    if (!prediction || prediction.isStale()) {
      const userTier = req.user.subscription?.tier || 'basic';
      prediction = await aiPredictionService.generatePrediction(symbol, userTier);
    }

    // Check if user has access to this prediction level
    const tierHierarchy = {
      'free': 0,
      'basic': 1,
      'pro': 2,
      'elite': 3
    };

    const userTier = req.user.subscription?.tier || 'free';
    const predictionTier = prediction.accessLevel;

    if (tierHierarchy[userTier] < tierHierarchy[predictionTier]) {
      return res.status(403).json({
        success: false,
        error: {
          message: `This prediction requires ${predictionTier} subscription`,
          code: 'PREMIUM_REQUIRED',
          requiredTier: predictionTier,
          currentTier: userTier
        }
      });
    }

    res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate new AI prediction
// @route   POST /api/v1/predictions/:symbol
// @access  Private (Pro tier+)
export const generatePrediction = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const userTier = req.user.subscription?.tier || 'pro';

    // Generate new prediction
    const prediction = await aiPredictionService.generatePrediction(symbol, userTier);

    res.status(201).json({
      success: true,
      data: prediction,
      message: 'Prediction generated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prediction history
// @route   GET /api/v1/predictions/:symbol/history
// @access  Private (Elite tier)
export const getPredictionHistory = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { limit = 10 } = req.query;

    const predictions = await Prediction.find({
      symbol: symbol.toUpperCase()
    })
    .sort({ 'metadata.generatedAt': -1 })
    .limit(parseInt(limit))
    .lean();

    res.status(200).json({
      success: true,
      data: predictions
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPrediction,
  generatePrediction,
  getPredictionHistory
};
