import Stock from '../models/Stock.js';
import StockPriceHistory from '../models/StockPriceHistory.js';
import stockDataService from '../services/stockDataService.js';

// @desc    Get all stocks
// @route   GET /api/v1/stocks
// @access  Public
export const getStocks = async (req, res, next) => {
  try {
    const { filter, limit = 20, page = 1 } = req.query;
    
    let query = { isActive: true };
    let sort = { symbol: 1 };

    // Apply filters
    if (filter === 'gainers') {
      sort = { changePercent: -1 };
    } else if (filter === 'losers') {
      sort = { changePercent: 1 };
    } else if (filter === 'volume') {
      sort = { volume: -1 };
    }

    const stocks = await Stock.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const total = await Stock.countDocuments(query);

    res.status(200).json({
      success: true,
      data: stocks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single stock
// @route   GET /api/v1/stocks/:symbol
// @access  Public
export const getStock = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    let stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Stock not found',
          code: 'STOCK_NOT_FOUND'
        }
      });
    }

    // Update if stale (older than 15 minutes)
    if (stock.isStale()) {
      try {
        stock = await stockDataService.updateStock(symbol);
      } catch (error) {
        console.error('Error updating stock:', error.message);
        // Continue with stale data
      }
    }

    res.status(200).json({
      success: true,
      data: stock
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search stocks
// @route   GET /api/v1/stocks/search
// @access  Public
export const searchStocks = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Search query is required',
          code: 'QUERY_REQUIRED'
        }
      });
    }

    const stocks = await stockDataService.searchStocks(q, parseInt(limit));

    res.status(200).json({
      success: true,
      data: stocks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top gainers
// @route   GET /api/v1/stocks/movers/gainers
// @access  Public
export const getTopGainers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const stocks = await stockDataService.getMarketMovers('gainers', parseInt(limit));

    res.status(200).json({
      success: true,
      data: stocks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top losers
// @route   GET /api/v1/stocks/movers/losers
// @access  Public
export const getTopLosers = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const stocks = await stockDataService.getMarketMovers('losers', parseInt(limit));

    res.status(200).json({
      success: true,
      data: stocks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get most traded stocks
// @route   GET /api/v1/stocks/movers/most-traded
// @access  Public
export const getMostTraded = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const stocks = await Stock.find({ isActive: true })
      .sort({ volume: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: stocks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get least traded stocks
// @route   GET /api/v1/stocks/movers/least-traded
// @access  Public
export const getLeastTraded = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    
    const stocks = await Stock.find({ isActive: true, volume: { $gt: 0 } })
      .sort({ volume: 1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      data: stocks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stocks in news
// @route   GET /api/v1/stocks/news
// @access  Public
export const getStocksInNews = async (req, res, next) => {
  try {
    // This would typically aggregate from News collection
    // For now, return stocks with recent activity
    const stocks = await Stock.find({ isActive: true })
      .sort({ lastUpdated: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: stocks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get stock price history
// @route   GET /api/v1/stocks/:symbol/history
// @access  Public
export const getStockHistory = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    const { days = 30, interval = '1day' } = req.query;

    const history = await StockPriceHistory.getHistory(
      symbol,
      parseInt(days),
      interval
    );

    res.status(200).json({
      success: true,
      data: history
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get company details
// @route   GET /api/v1/stocks/:symbol/company
// @access  Public
export const getCompanyDetails = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Stock not found',
          code: 'STOCK_NOT_FOUND'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: stock.companyInfo || {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get peer comparison
// @route   GET /api/v1/stocks/:symbol/peers
// @access  Public
export const getPeerComparison = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });

    if (!stock) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Stock not found',
          code: 'STOCK_NOT_FOUND'
        }
      });
    }

    // Get peer stocks
    const peers = await Stock.find({
      symbol: { $in: stock.peers || [] },
      isActive: true
    }).lean();

    res.status(200).json({
      success: true,
      data: peers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add stock to watchlist
// @route   POST /api/v1/stocks/:symbol/watchlist
// @access  Private
export const addToWatchlist = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    // Check if stock exists
    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
    if (!stock) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Stock not found',
          code: 'STOCK_NOT_FOUND'
        }
      });
    }

    // Add to watchlist if not already there
    if (!req.user.watchlist.includes(symbol.toUpperCase())) {
      req.user.watchlist.push(symbol.toUpperCase());
      await req.user.save();
    }

    res.status(200).json({
      success: true,
      data: req.user.watchlist,
      message: 'Stock added to watchlist'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/v1/stocks/:symbol/watchlist
// @access  Private
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const { symbol } = req.params;
    
    req.user.watchlist = req.user.watchlist.filter(
      s => s !== symbol.toUpperCase()
    );
    await req.user.save();

    res.status(200).json({
      success: true,
      data: req.user.watchlist,
      message: 'Stock removed from watchlist'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's watchlist
// @route   GET /api/v1/stocks/watchlist/my
// @access  Private
export const getWatchlist = async (req, res, next) => {
  try {
    const stocks = await Stock.find({
      symbol: { $in: req.user.watchlist },
      isActive: true
    }).lean();

    res.status(200).json({
      success: true,
      data: stocks
    });
  } catch (error) {
    next(error);
  }
};

export default {
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
};
