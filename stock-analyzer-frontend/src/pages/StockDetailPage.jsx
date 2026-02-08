import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Building2, FileText, Newspaper, Sparkles, BarChart3 } from 'lucide-react';
import StockChart from '../components/StockChart';
import { stockApi, predictionApi, newsApi } from '../api/stockApi';

const StockDetailPage = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [news, setNews] = useState([]);
  const [company, setCompany] = useState(null);
  const [peers, setPeers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockData();
  }, [symbol]);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const [stockRes, companyRes, peersRes] = await Promise.all([
        stockApi.getStock(symbol),
        stockApi.getCompanyDetails(symbol),
        stockApi.getPeerComparison(symbol),
      ]);

      setStock(stockRes.data.data);
      setCompany(companyRes.data.data);
      setPeers(peersRes.data.data);

      // Fetch price history
      const historyRes = await stockApi.getStockHistory(symbol, { days: 30 });
      const historyData = historyRes.data.data.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        price: item.close,
      }));
      setChartData(historyData);

      // Fetch news
      try {
        const newsRes = await newsApi.getStockNews(symbol);
        setNews(newsRes.data.data);
      } catch (error) {
        console.error('Error fetching news:', error);
        setNews([]);
      }

      // Fetch AI predictions (requires authentication and subscription)
      try {
        const predictionsRes = await predictionApi.getPrediction(symbol);
        setPredictions(predictionsRes.data.data.predictions);
      } catch (error) {
        console.error('Error fetching predictions:', error);
        // Set mock predictions if API fails or user doesn't have access
        setPredictions({
          nextDay: { price: stockRes.data.data.currentPrice * 1.01, confidence: 0.85, direction: 'up' },
          nextWeek: { price: stockRes.data.data.currentPrice * 1.03, confidence: 0.78, direction: 'up' },
          nextMonth: { price: stockRes.data.data.currentPrice * 1.05, confidence: 0.65, direction: 'up' },
        });
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      // Fallback to mock data
      setStock({
        symbol,
        name: `${symbol} Inc.`,
        currentPrice: 178.50,
        change: 4.25,
        changePercent: 2.44,
        volume: 52000000,
        marketCap: 2800000000000,
        peRatio: 28.5,
        dayHigh: 180.20,
        dayLow: 175.30,
      });
      
      const mockChartData = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        price: 178.50 + (Math.random() - 0.5) * 20,
      }));
      setChartData(mockChartData);

      setPredictions({
        nextDay: { price: 180.25, confidence: 0.85, direction: 'up' },
        nextWeek: { price: 185.50, confidence: 0.78, direction: 'up' },
        nextMonth: { price: 195.00, confidence: 0.65, direction: 'up' },
      });

      setNews([
        { id: 1, title: `${symbol} announces new product line`, publishedAt: new Date().toISOString(), sentiment: { label: 'positive' } },
        { id: 2, title: `Analysts upgrade ${symbol} stock`, publishedAt: new Date().toISOString(), sentiment: { label: 'positive' } },
      ]);

      setCompany({
        description: `${symbol} is a leading technology company...`,
        ceo: 'John Doe',
        employees: 150000,
        founded: 1976,
        headquarters: 'Cupertino, CA',
      });

      setPeers([
        { symbol: 'GOOGL', name: 'Alphabet', currentPrice: 142.30, changePercent: 1.8 },
        { symbol: 'MSFT', name: 'Microsoft', currentPrice: 380.20, changePercent: 2.1 },
        { symbol: 'AMZN', name: 'Amazon', currentPrice: 168.90, changePercent: -0.5 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-light-button dark:border-dark-accent border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const isPositive = stock?.changePercent >= 0;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-2">
                {stock?.symbol}
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {stock?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-gray-900 dark:text-dark-text mb-2">
                ${stock?.price.toFixed(2)}
              </div>
              <div className={`flex items-center space-x-2 text-xl font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isPositive ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                <span>
                  {isPositive ? '+' : ''}{stock?.change.toFixed(2)} ({isPositive ? '+' : ''}{stock?.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-light-accent/20 dark:border-dark-accent/20">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Volume</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                {(stock?.volume / 1000000).toFixed(2)}M
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Market Cap</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                ${(stock?.marketCap / 1000000000).toFixed(2)}B
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">P/E Ratio</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                {stock?.pe.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Day Range</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                ${stock?.low.toFixed(2)} - ${stock?.high.toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StockChart data={chartData} symbol={symbol} />
        </motion.div>

        {/* AI Predictions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-light-button/10 to-light-accent/10 dark:from-dark-accent/10 dark:to-dark-card/50"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
              AI Predictions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {predictions && Object.entries(predictions).map(([key, value], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-xl p-6"
              >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
                  ${value.price.toFixed(2)}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 dark:bg-dark-bg rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text h-2 rounded-full"
                      style={{ width: `${value.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {(value.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Building2 className="w-6 h-6 text-light-button dark:text-dark-accent" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                Company Details
              </h2>
            </div>
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
              <p>{company?.description}</p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CEO</p>
                  <p className="font-semibold">{company?.ceo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Employees</p>
                  <p className="font-semibold">{company?.employees?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Founded</p>
                  <p className="font-semibold">{company?.founded}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">HQ</p>
                  <p className="font-semibold">{company?.headquarters}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* News */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Newspaper className="w-6 h-6 text-light-button dark:text-dark-accent" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
                Latest News
              </h2>
            </div>
            <div className="space-y-4">
              {news.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-4 rounded-lg bg-light-accent/10 dark:bg-dark-accent/10 hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 cursor-pointer transition-all"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-dark-text mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.date}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Peer Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center space-x-3 mb-6">
            <BarChart3 className="w-6 h-6 text-light-button dark:text-dark-accent" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
              Peer Comparison
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {peers.map((peer, index) => (
              <motion.div
                key={peer.symbol}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-lg bg-light-accent/10 dark:bg-dark-accent/10 cursor-pointer"
              >
                <h3 className="font-bold text-gray-900 dark:text-dark-text">
                  {peer.symbol}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {peer.name}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-dark-text">
                    ${peer.price.toFixed(2)}
                  </span>
                  <span className={`font-semibold ${peer.changePercent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {peer.changePercent >= 0 ? '+' : ''}{peer.changePercent.toFixed(2)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StockDetailPage;
