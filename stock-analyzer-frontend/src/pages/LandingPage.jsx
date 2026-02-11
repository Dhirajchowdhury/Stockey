import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, TrendingDown, Sparkles, LayoutDashboard, 
  Crown, FileText, ChevronDown, BarChart3, Newspaper,
  Activity, DollarSign
} from 'lucide-react';
import { stockApi } from '../api/stockApi';
import Footer from '../components/Footer';

const LandingPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });

  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [showGainers, setShowGainers] = useState(true);
  const [capType, setCapType] = useState('large');
  const [news, setNews] = useState([]);

  const mockStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', currentPrice: 178.50, changePercent: 2.5 },
    { symbol: 'GOOGL', name: 'Alphabet', currentPrice: 142.30, changePercent: 1.8 },
    { symbol: 'MSFT', name: 'Microsoft', currentPrice: 380.20, changePercent: 3.2 },
    { symbol: 'TSLA', name: 'Tesla', currentPrice: 245.60, changePercent: 4.1 },
    { symbol: 'AMZN', name: 'Amazon', currentPrice: 168.90, changePercent: 1.2 },
  ];

  const mockNews = [
    { id: 1, title: 'Market reaches new highs amid tech rally', source: 'Financial Times' },
    { id: 2, title: 'Fed signals potential rate cuts', source: 'Bloomberg' },
    { id: 3, title: 'AI stocks surge on breakthrough', source: 'Reuters' },
  ];

  const capData = {
    large: { value: '$2.8T', change: '+2.4%', stocks: 50 },
    mid: { value: '$850B', change: '+1.8%', stocks: 150 },
    small: { value: '$320B', change: '+3.1%', stocks: 500 },
  };

  const stackedCards = [
    {
      id: 1,
      title: 'Your AI-Powered Stock Market Companion',
      subtitle: 'Make smarter investment decisions with real-time data and AI predictions',
      cta: 'Get Started Free',
      image: '📊',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      id: 2,
      icon: Activity,
      title: 'Real-Time Stock Details',
      description: 'Access comprehensive stock information, live prices, charts, and market trends all in one place',
      features: ['Live Price Updates', 'Historical Charts', 'Company Fundamentals', 'Peer Comparison'],
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 3,
      icon: LayoutDashboard,
      title: 'Personalized Dashboard',
      description: 'Create your custom watchlist and track your favorite stocks with an intuitive interface',
      features: ['Custom Watchlists', 'Portfolio Tracking', 'Price Alerts', 'Performance Analytics'],
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 4,
      icon: Crown,
      title: 'Premium AI Predictions',
      description: 'Unlock advanced AI-powered predictions and exclusive market insights',
      features: ['AI Price Forecasts', 'Sentiment Analysis', 'Risk Assessment', 'Expert Reports'],
      color: 'from-purple-500 to-pink-600',
    },
    {
      id: 5,
      icon: FileText,
      title: 'Handcrafted Analysis',
      description: 'Get detailed, human-verified analysis and reports from market experts',
      features: ['Expert Commentary', 'Quarterly Reports', 'Industry Analysis', 'Market Insights'],
      color: 'from-cyan-500 to-blue-600',
    },
  ];

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    try {
      const [gainers, losers, newsData] = await Promise.all([
        stockApi.getTopGainers(),
        stockApi.getTopLosers(),
        stockApi.getStocksInNews(),
      ]);

      setTopGainers(gainers.data.data || mockStocks);
      setTopLosers(losers.data.data || mockStocks.map(s => ({ ...s, changePercent: -Math.abs(s.changePercent) })));
      setNews(newsData.data.data || mockNews);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setTopGainers(mockStocks);
      setTopLosers(mockStocks.map(s => ({ ...s, changePercent: -Math.abs(s.changePercent) })));
      setNews(mockNews);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Stacked Cards Hero Section */}
      <section className="relative px-4 pt-32 pb-20">
        <div className="fixed inset-0 bg-gradient-to-br from-light-bg via-light-card to-light-accent dark:from-dark-bg dark:via-dark-card dark:to-dark-accent opacity-50 -z-10" />
        
        <div className="max-w-6xl mx-auto min-h-[500vh]">
          {stackedCards.map((card, index) => {
            const cardStart = index * 0.2;
            const cardEnd = (index + 1) * 0.2;
            const cardProgress = useTransform(scrollYProgress, [cardStart, cardEnd], [0, 1]);
            const y = useTransform(cardProgress, [0, 1], [0, -150]);
            const opacity = useTransform(cardProgress, [0, 0.8, 1], [1, 0.5, 0]);
            const scale = useTransform(cardProgress, [0, 1], [1, 0.95]);

            return (
              <motion.div
                key={card.id}
                style={{ y, opacity, scale }}
                className="sticky top-32 mb-8"
              >
                <div
                  className="relative h-[600px] bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden"
                  style={{ transform: `translateY(${index * 20}px) scale(${1 - index * 0.02})` }}
                >
                  {index === 0 ? (
                    <div className="h-full flex flex-col md:flex-row items-center justify-between p-12">
                      <div className="flex-1 space-y-6">
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-dark-text leading-tight"
                        >
                          {card.title}
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xl text-gray-600 dark:text-gray-400"
                        >
                          {card.subtitle}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Link to="/signup">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className={`px-8 py-4 rounded-xl bg-gradient-to-r ${card.gradient} text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all`}
                            >
                              {card.cta}
                            </motion.button>
                          </Link>
                        </motion.div>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <motion.div
                          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          className="text-9xl"
                        >
                          {card.image}
                        </motion.div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full p-12 flex flex-col justify-center">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${card.color} w-fit mb-6`}>
                        <card.icon className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-4">
                        {card.title}
                      </h2>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        {card.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        {card.features.map((feature, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-center space-x-2"
                          >
                            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${card.color}`} />
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl font-bold text-center mb-16 text-gray-900 dark:text-dark-text"
        >
          Market at a Glance
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-fr">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-3xl p-8 backdrop-blur-sm border border-purple-500/20"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text">AI Predictions</h3>
            </div>
            <div className="space-y-4">
              <div className="text-6xl font-bold text-gray-900 dark:text-dark-text">85%</div>
              <p className="text-xl text-gray-600 dark:text-gray-400">Accuracy Rate</p>
              <div className="pt-4">
                <div className="h-40 bg-gradient-to-t from-purple-500/20 to-transparent rounded-xl flex items-end justify-around p-4">
                  {[60, 75, 85, 70, 90, 80, 95].map((height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      transition={{ delay: i * 0.1 }}
                      className="w-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-1 md:row-span-2 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                {showGainers ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
                <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">
                  {showGainers ? 'Top Gainers' : 'Top Losers'}
                </h3>
              </div>
              <button
                onClick={() => setShowGainers(!showGainers)}
                className="p-2 hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 rounded-lg transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {(showGainers ? topGainers : topLosers).slice(0, 5).map((stock, i) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition-colors"
                >
                  <div>
                    <div className="font-bold text-gray-900 dark:text-dark-text">{stock.symbol}</div>
                    <div className="text-sm text-gray-500">${stock.currentPrice?.toFixed(2)}</div>
                  </div>
                  <div className={`font-bold ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 rounded-3xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text uppercase">
                {capType} Cap
              </h3>
              <select
                value={capType}
                onChange={(e) => setCapType(e.target.value)}
                className="text-sm bg-transparent border border-blue-500/30 rounded-lg px-2 py-1 text-gray-900 dark:text-dark-text"
              >
                <option value="large">Large</option>
                <option value="mid">Mid</option>
                <option value="small">Small</option>
              </select>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
              {capData[capType].value}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-green-500 font-semibold">{capData[capType].change}</span>
              <span className="text-sm text-gray-500">{capData[capType].stocks} stocks</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/20 rounded-3xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text uppercase">Market</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">+2.4%</div>
            <div className="h-16 flex items-end justify-between">
              {[40, 60, 45, 70, 55, 80, 65].map((height, i) => (
                <div
                  key={i}
                  className="w-2 bg-gradient-to-t from-green-500 to-emerald-500 rounded-t"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-orange-500/10 to-red-500/10 dark:from-orange-500/20 dark:to-red-500/20 rounded-3xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2 mb-4">
              <Activity className="w-5 h-5 text-orange-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text uppercase">Volume</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">8.2B</div>
            <div className="text-sm text-gray-500">Shares traded</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="md:col-span-2 bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <Newspaper className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-dark-text">Latest News</h3>
            </div>
            <div className="space-y-3">
              {news.slice(0, 3).map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-3 rounded-xl hover:bg-light-accent/10 dark:hover:bg-dark-accent/10 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-gray-900 dark:text-dark-text text-sm mb-1">
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500">{item.source}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-3xl p-6 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-2 mb-4">
              <DollarSign className="w-5 h-5 text-indigo-500" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-dark-text uppercase">Total Value</h3>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">$45.2T</div>
            <div className="text-sm text-gray-500">Market cap</div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-gradient-to-br from-light-button to-light-accent dark:from-dark-accent dark:to-dark-card rounded-3xl p-12 text-center shadow-2xl"
        >
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of investors making smarter decisions with AI-powered insights
            </p>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-white text-light-button dark:text-dark-bg font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                Start Free Trial
              </motion.button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </motion.div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
