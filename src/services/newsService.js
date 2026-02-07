import axios from 'axios';
import News from '../models/News.js';

class NewsService {
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY;
    this.apiUrl = process.env.NEWS_API_URL;
  }

  // Fetch news from external API
  async fetchNews(query = 'stock market', pageSize = 20) {
    try {
      const response = await axios.get(`${this.apiUrl}/everything`, {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: pageSize,
          apiKey: this.apiKey
        }
      });

      return response.data.articles;
    } catch (error) {
      console.error('Error fetching news:', error.message);
      throw error;
    }
  }

  // Fetch stock-specific news
  async fetchStockNews(symbol, pageSize = 10) {
    try {
      const response = await axios.get(`${this.apiUrl}/everything`, {
        params: {
          q: `${symbol} stock`,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: pageSize,
          apiKey: this.apiKey
        }
      });

      return response.data.articles;
    } catch (error) {
      console.error(`Error fetching news for ${symbol}:`, error.message);
      throw error;
    }
  }

  // Save news to database
  async saveNews(articles, relatedStocks = []) {
    try {
      const newsItems = articles.map(article => ({
        title: article.title,
        content: article.content || article.description,
        excerpt: article.description,
        url: article.url,
        source: {
          name: article.source.name,
          url: article.source.url
        },
        author: article.author,
        publishedAt: new Date(article.publishedAt),
        imageUrl: article.urlToImage,
        relatedStocks: relatedStocks
      }));

      // Use bulkWrite to avoid duplicates
      const operations = newsItems.map(news => ({
        updateOne: {
          filter: { url: news.url },
          update: { $set: news },
          upsert: true
        }
      }));

      const result = await News.bulkWrite(operations);
      return result;
    } catch (error) {
      console.error('Error saving news:', error.message);
      throw error;
    }
  }

  // Extract stock symbols from news content
  extractStockSymbols(text) {
    // Simple regex to find potential stock symbols (3-5 uppercase letters)
    const symbolRegex = /\b[A-Z]{2,5}\b/g;
    const matches = text.match(symbolRegex) || [];
    
    // Filter out common words that aren't stock symbols
    const commonWords = ['THE', 'AND', 'FOR', 'ARE', 'BUT', 'NOT', 'YOU', 'ALL', 'CAN', 'HER', 'WAS', 'ONE', 'OUR', 'OUT', 'DAY', 'GET', 'HAS', 'HIM', 'HIS', 'HOW', 'ITS', 'MAY', 'NEW', 'NOW', 'OLD', 'SEE', 'TWO', 'WHO', 'BOY', 'DID', 'ITS', 'LET', 'PUT', 'SAY', 'SHE', 'TOO', 'USE'];
    
    return [...new Set(matches.filter(symbol => !commonWords.includes(symbol)))];
  }

  // Analyze sentiment using simple keyword matching (replace with ML model)
  analyzeSentiment(text) {
    const positiveWords = ['gain', 'profit', 'growth', 'surge', 'rally', 'bullish', 'upgrade', 'beat', 'strong', 'positive', 'rise', 'increase', 'up'];
    const negativeWords = ['loss', 'decline', 'fall', 'drop', 'bearish', 'downgrade', 'miss', 'weak', 'negative', 'down', 'decrease', 'crash'];
    
    const lowerText = text.toLowerCase();
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) positiveCount += matches.length;
    });
    
    negativeWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = lowerText.match(regex);
      if (matches) negativeCount += matches.length;
    });
    
    const total = positiveCount + negativeCount;
    if (total === 0) {
      return { score: 0, label: 'neutral', confidence: 0.5 };
    }
    
    const score = (positiveCount - negativeCount) / total;
    const label = score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral';
    const confidence = Math.abs(score);
    
    return { score, label, confidence };
  }

  // Update news with sentiment analysis
  async updateNewsSentiment(newsId) {
    try {
      const news = await News.findById(newsId);
      if (!news) throw new Error('News not found');
      
      const sentiment = this.analyzeSentiment(news.title + ' ' + news.content);
      
      news.sentiment = {
        ...sentiment,
        analyzedAt: new Date()
      };
      
      await news.save();
      return news;
    } catch (error) {
      console.error('Error updating sentiment:', error.message);
      throw error;
    }
  }

  // Bulk update sentiment for all news
  async bulkUpdateSentiment(limit = 100) {
    try {
      const newsItems = await News.find({
        'sentiment.analyzedAt': { $exists: false }
      }).limit(limit);
      
      const results = {
        success: 0,
        failed: 0
      };
      
      for (const news of newsItems) {
        try {
          await this.updateNewsSentiment(news._id);
          results.success++;
        } catch (error) {
          results.failed++;
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error bulk updating sentiment:', error.message);
      throw error;
    }
  }
}

export default new NewsService();
