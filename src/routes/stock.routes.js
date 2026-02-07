import express from 'express';
import {
  getStocks,
  getStock,
  searchStocks,
  getTopGainers,
  getTopLosers,
  getMostTraded,
  getLeastTraded,
  getStocksInNews,
  getStockHistory,
  getCompanyDetails,
  getPeerComparison,
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist
} from '../controllers/stock.controller.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { searchLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// @route   GET /api/v1/stocks
// @desc    Get all stocks with filters
// @access  Public
router.get('/', optionalAuth, getStocks);

// @route   GET /api/v1/stocks/search
// @desc    Search stocks
// @access  Public
router.get('/search', searchLimiter, searchStocks);

// @route   GET /api/v1/stocks/movers/gainers
// @desc    Get top gainers
// @access  Public
router.get('/movers/gainers', getTopGainers);

// @route   GET /api/v1/stocks/movers/losers
// @desc    Get top losers
// @access  Public
router.get('/movers/losers', getTopLosers);

// @route   GET /api/v1/stocks/movers/most-traded
// @desc    Get most traded stocks
// @access  Public
router.get('/movers/most-traded', getMostTraded);

// @route   GET /api/v1/stocks/movers/least-traded
// @desc    Get least traded stocks
// @access  Public
router.get('/movers/least-traded', getLeastTraded);

// @route   GET /api/v1/stocks/news
// @desc    Get stocks in news
// @access  Public
router.get('/news', getStocksInNews);

// @route   GET /api/v1/stocks/:symbol
// @desc    Get single stock details
// @access  Public
router.get('/:symbol', optionalAuth, getStock);

// @route   GET /api/v1/stocks/:symbol/history
// @desc    Get stock price history
// @access  Public
router.get('/:symbol/history', getStockHistory);

// @route   GET /api/v1/stocks/:symbol/company
// @desc    Get company details
// @access  Public
router.get('/:symbol/company', getCompanyDetails);

// @route   GET /api/v1/stocks/:symbol/peers
// @desc    Get peer comparison
// @access  Public
router.get('/:symbol/peers', getPeerComparison);

// Watchlist routes (protected)
// @route   POST /api/v1/stocks/:symbol/watchlist
// @desc    Add stock to watchlist
// @access  Private
router.post('/:symbol/watchlist', protect, addToWatchlist);

// @route   DELETE /api/v1/stocks/:symbol/watchlist
// @desc    Remove stock from watchlist
// @access  Private
router.delete('/:symbol/watchlist', protect, removeFromWatchlist);

// @route   GET /api/v1/stocks/watchlist/my
// @desc    Get user's watchlist
// @access  Private
router.get('/watchlist/my', protect, getWatchlist);

export default router;
