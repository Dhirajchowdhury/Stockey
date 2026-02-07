import express from 'express';
import {
  getPrediction,
  generatePrediction,
  getPredictionHistory
} from '../controllers/prediction.controller.js';
import { protect, requirePremium } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// @route   GET /api/v1/predictions/:symbol
// @desc    Get AI prediction for a stock
// @access  Private (Basic tier+)
router.get('/:symbol', protect, requirePremium('basic'), getPrediction);

// @route   POST /api/v1/predictions/:symbol
// @desc    Generate new AI prediction
// @access  Private (Pro tier+)
router.post('/:symbol', protect, requirePremium('pro'), aiLimiter, generatePrediction);

// @route   GET /api/v1/predictions/:symbol/history
// @desc    Get prediction history
// @access  Private (Elite tier)
router.get('/:symbol/history', protect, requirePremium('elite'), getPredictionHistory);

export default router;
