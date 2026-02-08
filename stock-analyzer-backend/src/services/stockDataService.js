import axios from 'axios';
import Stock from '../models/Stock.js';
import StockPriceHistory from '../models/StockPriceHistory.js';

class StockDataService {
  constructor() {
    this.apiKey = process.env.STOCK_API_KEY;
    this.apiUrl = process.env.STOCK_API_URL;
  }

  // Fetch stock data from external API (Alpha Vantage example)
  async fetchStockData(symbol) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: this.apiKey
        }
      });

      const quote = response.data['Global Quote'];
      
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error('Stock not found');
      }

      return {
        symbol: quote['01. symbol'],
        currentPrice: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        previousClose: parseFloat(quote['08. previous close']),
        open: parseFloat(quote['02. open']),
        dayHigh: parseFloat(quote['03. high']),
        dayLow: parseFloat(quote['04. low'])
      };
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Fetch historical data
  async fetchHistoricalData(symbol, interval = 'daily', outputSize = 'compact') {
    try {
      const functionMap = {
        'daily': 'TIME_SERIES_DAILY',
        'weekly': 'TIME_SERIES_WEEKLY',
        'monthly': 'TIME_SERIES_MONTHLY'
      };

      const response = await axios.get(this.apiUrl, {
        params: {
          function: functionMap[interval] || 'TIME_SERIES_DAILY',
          symbol: symbol,
          outputsize: outputSize,
          apikey: this.apiKey
        }
      });

      const timeSeriesKey = Object.keys(response.data).find(key => key.includes('Time Series'));
      const timeSeries = response.data[timeSeriesKey];

      if (!timeSeries) {
        throw new Error('No historical data found');
      }

      const historicalData = [];
      for (const [date, values] of Object.entries(timeSeries)) {
        historicalData.push({
          symbol: symbol.toUpperCase(),
          date: new Date(date),
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume']),
          interval: interval === 'daily' ? '1day' : interval === 'weekly' ? '1week' : '1month'
        });
      }

      return historicalData;
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Update stock in database
  async updateStock(symbol) {
    try {
      const stockData = await this.fetchStockData(symbol);
      
      const stock = await Stock.findOneAndUpdate(
        { symbol: symbol.toUpperCase() },
        {
          ...stockData,
          lastUpdated: new Date()
        },
        { new: true, upsert: true }
      );

      return stock;
    } catch (error) {
      console.error(`Error updating stock ${symbol}:`, error.message);
      throw error;
    }
  }

  // Bulk update stocks
  async bulkUpdateStocks(symbols) {
    const results = {
      success: [],
      failed: []
    };

    for (const symbol of symbols) {
      try {
        await this.updateStock(symbol);
        results.success.push(symbol);
        
        // Rate limiting - wait 12 seconds between requests (Alpha Vantage free tier limit)
        await new Promise(resolve => setTimeout(resolve, 12000));
      } catch (error) {
        results.failed.push({ symbol, error: error.message });
      }
    }

    return results;
  }

  // Save historical data to database
  async saveHistoricalData(symbol, interval = 'daily') {
    try {
      const historicalData = await this.fetchHistoricalData(symbol, interval);
      
      // Use bulkWrite for efficient insertion
      const operations = historicalData.map(data => ({
        updateOne: {
          filter: { symbol: data.symbol, date: data.date, interval: data.interval },
          update: { $set: data },
          upsert: true
        }
      }));

      const result = await StockPriceHistory.bulkWrite(operations);
      return result;
    } catch (error) {
      console.error(`Error saving historical data for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Get top gainers/losers (mock implementation - replace with real API)
  async getMarketMovers(type = 'gainers', limit = 10) {
    try {
      const sortField = type === 'gainers' ? -1 : 1;
      
      const stocks = await Stock.find({ isActive: true })
        .sort({ changePercent: sortField })
        .limit(limit)
        .lean();

      return stocks;
    } catch (error) {
      console.error(`Error fetching ${type}:`, error.message);
      throw error;
    }
  }

  // Search stocks
  async searchStocks(query, limit = 10) {
    try {
      const stocks = await Stock.find({
        $or: [
          { symbol: { $regex: query, $options: 'i' } },
          { name: { $regex: query, $options: 'i' } }
        ],
        isActive: true
      })
      .limit(limit)
      .lean();

      return stocks;
    } catch (error) {
      console.error('Error searching stocks:', error.message);
      throw error;
    }
  }
}

export default new StockDataService();
