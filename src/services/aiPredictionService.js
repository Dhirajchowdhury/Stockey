import OpenAI from 'openai';
import Stock from '../models/Stock.js';
import StockPriceHistory from '../models/StockPriceHistory.js';
import News from '../models/News.js';
import Prediction from '../models/Prediction.js';

class AIPredictionService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.mlServiceUrl = process.env.ML_SERVICE_URL;
    this.mlServiceEnabled = process.env.ML_SERVICE_ENABLED === 'true';
  }

  // Calculate technical indicators
  async calculateIndicators(symbol) {
    try {
      const history = await StockPriceHistory.getHistory(symbol, 90);
      
      if (history.length < 30) {
        throw new Error('Insufficient historical data');
      }

      const closes = history.map(h => h.close);
      const volumes = history.map(h => h.volume);

      // Calculate Moving Averages
      const ma7 = this.calculateMA(closes, 7);
      const ma30 = this.calculateMA(closes, 30);
      const ma90 = this.calculateMA(closes, 90);

      // Calculate RSI
      const rsi = this.calculateRSI(closes, 14);

      // Calculate MACD
      const macd = this.calculateMACD(closes);

      // Calculate volatility
      const volatility = this.calculateVolatility(closes, 30);

      // Average volume
      const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;

      return {
        priceMovingAverage: { ma7, ma30, ma90 },
        rsi,
        macd,
        historicalVolatility: volatility,
        averageVolume: avgVolume
      };
    } catch (error) {
      console.error('Error calculating indicators:', error.message);
      throw error;
    }
  }

  // Simple Moving Average
  calculateMA(data, period) {
    if (data.length < period) return null;
    const slice = data.slice(-period);
    return slice.reduce((a, b) => a + b, 0) / period;
  }

  // Relative Strength Index
  calculateRSI(closes, period = 14) {
    if (closes.length < period + 1) return null;

    let gains = 0;
    let losses = 0;

    for (let i = closes.length - period; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) return 100;

    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  // MACD (Moving Average Convergence Divergence)
  calculateMACD(closes) {
    if (closes.length < 26) return null;

    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);
    const macdLine = ema12 - ema26;

    // Signal line (9-day EMA of MACD)
    const macdHistory = [];
    for (let i = 26; i < closes.length; i++) {
      const slice = closes.slice(0, i + 1);
      const e12 = this.calculateEMA(slice, 12);
      const e26 = this.calculateEMA(slice, 26);
      macdHistory.push(e12 - e26);
    }

    const signal = this.calculateEMA(macdHistory, 9);
    const histogram = macdLine - signal;

    return { value: macdLine, signal, histogram };
  }

  // Exponential Moving Average
  calculateEMA(data, period) {
    if (data.length < period) return null;

    const multiplier = 2 / (period + 1);
    let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < data.length; i++) {
      ema = (data[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  // Historical Volatility
  calculateVolatility(closes, period = 30) {
    if (closes.length < period) return null;

    const returns = [];
    for (let i = 1; i < closes.length; i++) {
      returns.push(Math.log(closes[i] / closes[i - 1]));
    }

    const recentReturns = returns.slice(-period);
    const mean = recentReturns.reduce((a, b) => a + b, 0) / period;
    const variance = recentReturns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / period;
    
    return Math.sqrt(variance) * Math.sqrt(252); // Annualized volatility
  }

  // Get sentiment score for stock
  async getSentimentScore(symbol) {
    try {
      const news = await News.getStockNews(symbol, 20);
      
      if (news.length === 0) return 0;

      const sentimentScores = news
        .filter(n => n.sentiment && n.sentiment.score !== undefined)
        .map(n => n.sentiment.score);

      if (sentimentScores.length === 0) return 0;

      return sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length;
    } catch (error) {
      console.error('Error getting sentiment score:', error.message);
      return 0;
    }
  }

  // Generate prediction using ML model (mock implementation)
  async generateMLPrediction(symbol, indicators, currentPrice) {
    // This is a simplified prediction model
    // In production, replace with actual LSTM/Prophet/ARIMA model

    const { rsi, macd, historicalVolatility, priceMovingAverage } = indicators;

    // Trend analysis
    const trendScore = priceMovingAverage.ma7 > priceMovingAverage.ma30 ? 1 : -1;
    
    // RSI analysis (oversold/overbought)
    const rsiScore = rsi < 30 ? 1 : rsi > 70 ? -1 : 0;
    
    // MACD analysis
    const macdScore = macd && macd.histogram > 0 ? 1 : -1;

    // Combine signals
    const combinedScore = (trendScore + rsiScore + macdScore) / 3;

    // Generate predictions
    const volatilityFactor = historicalVolatility || 0.2;
    
    const nextDayChange = combinedScore * volatilityFactor * 0.02;
    const nextWeekChange = combinedScore * volatilityFactor * 0.05;
    const nextMonthChange = combinedScore * volatilityFactor * 0.10;

    return {
      nextDay: {
        price: currentPrice * (1 + nextDayChange),
        change: currentPrice * nextDayChange,
        changePercent: nextDayChange * 100,
        confidence: 0.75 - (volatilityFactor * 0.5),
        direction: nextDayChange > 0.001 ? 'up' : nextDayChange < -0.001 ? 'down' : 'neutral'
      },
      nextWeek: {
        price: currentPrice * (1 + nextWeekChange),
        change: currentPrice * nextWeekChange,
        changePercent: nextWeekChange * 100,
        confidence: 0.65 - (volatilityFactor * 0.5),
        direction: nextWeekChange > 0.001 ? 'up' : nextWeekChange < -0.001 ? 'down' : 'neutral'
      },
      nextMonth: {
        price: currentPrice * (1 + nextMonthChange),
        change: currentPrice * nextMonthChange,
        changePercent: nextMonthChange * 100,
        confidence: 0.55 - (volatilityFactor * 0.5),
        direction: nextMonthChange > 0.001 ? 'up' : nextMonthChange < -0.001 ? 'down' : 'neutral'
      }
    };
  }

  // Generate explanation using LLM
  async generateExplanation(symbol, stock, indicators, predictions) {
    try {
      const prompt = `As a financial analyst, provide a concise explanation for the stock prediction of ${symbol} (${stock.name}).

Current Price: $${stock.currentPrice}
Predicted Next Day: $${predictions.nextDay.price.toFixed(2)} (${predictions.nextDay.direction})
Predicted Next Week: $${predictions.nextWeek.price.toFixed(2)} (${predictions.nextWeek.direction})
Predicted Next Month: $${predictions.nextMonth.price.toFixed(2)} (${predictions.nextMonth.direction})

Technical Indicators:
- RSI: ${indicators.rsi?.toFixed(2)}
- MACD: ${indicators.macd?.value.toFixed(2)}
- Volatility: ${(indicators.historicalVolatility * 100).toFixed(2)}%
- MA7: $${indicators.priceMovingAverage.ma7?.toFixed(2)}
- MA30: $${indicators.priceMovingAverage.ma30?.toFixed(2)}

Provide:
1. A brief summary (2-3 sentences)
2. 3 key factors influencing the prediction
3. 2 potential risks
4. 1 opportunity

Format as JSON with keys: summary, keyFactors (array), risks (array), opportunities (array)`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = JSON.parse(completion.choices[0].message.content);

      return {
        summary: response.summary,
        keyFactors: response.keyFactors,
        risks: response.risks,
        opportunities: response.opportunities,
        llmGenerated: true
      };
    } catch (error) {
      console.error('Error generating LLM explanation:', error.message);
      
      // Fallback explanation
      return {
        summary: `Based on technical analysis, ${symbol} shows ${predictions.nextWeek.direction} momentum with ${(predictions.nextWeek.confidence * 100).toFixed(0)}% confidence.`,
        keyFactors: [
          `Current RSI: ${indicators.rsi?.toFixed(2)}`,
          `MACD signal: ${indicators.macd?.histogram > 0 ? 'Bullish' : 'Bearish'}`,
          `Volatility: ${(indicators.historicalVolatility * 100).toFixed(2)}%`
        ],
        risks: [
          'Market volatility may affect accuracy',
          'External events not factored in model'
        ],
        opportunities: [
          predictions.nextWeek.direction === 'up' ? 'Potential upward trend' : 'Potential buying opportunity'
        ],
        llmGenerated: false
      };
    }
  }

  // Main prediction generation function
  async generatePrediction(symbol, accessLevel = 'basic') {
    try {
      // Get stock data
      const stock = await Stock.findOne({ symbol: symbol.toUpperCase() });
      if (!stock) throw new Error('Stock not found');

      // Check for existing recent prediction
      const existingPrediction = await Prediction.getLatest(symbol);
      if (existingPrediction && !existingPrediction.isStale()) {
        return existingPrediction;
      }

      const startTime = Date.now();

      // Calculate technical indicators
      const indicators = await this.calculateIndicators(symbol);

      // Get sentiment score
      const sentimentScore = await this.getSentimentScore(symbol);
      indicators.sentimentScore = sentimentScore;

      // Generate ML predictions
      const predictions = await this.generateMLPrediction(symbol, indicators, stock.currentPrice);

      // Generate LLM explanation
      const explanation = await this.generateExplanation(symbol, stock, indicators, predictions);

      const processingTime = Date.now() - startTime;

      // Save prediction
      const prediction = await Prediction.create({
        symbol: symbol.toUpperCase(),
        currentPrice: stock.currentPrice,
        predictions,
        features: indicators,
        model: {
          type: 'ensemble',
          version: '1.0.0',
          accuracy: 0.72,
          trainingDate: new Date()
        },
        explanation,
        metadata: {
          generatedAt: new Date(),
          expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours
          processingTime,
          dataPoints: await StockPriceHistory.countDocuments({ symbol: symbol.toUpperCase() })
        },
        accessLevel,
        isActive: true
      });

      return prediction;
    } catch (error) {
      console.error(`Error generating prediction for ${symbol}:`, error.message);
      throw error;
    }
  }
}

export default new AIPredictionService();
