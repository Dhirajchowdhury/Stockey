import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { TrendingUp, TrendingDown, Zap, Shield, BarChart3, Newspaper } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import MarketWidget from '../components/MarketWidget';
import { stockApi } from '../api/stockApi';

const LandingPage = () => {
  const heroRef = useRef(null);
  const [topGainers, setTopGainers] = useState([]);
  const [topLosers, setTopLosers] = useState([]);
  const [mostTraded, setMostTraded] = useState([]);
  const [leastTraded, setLeastTraded] = useState([]);
  const [stocksInNews, setStocksInNews] = useState([]);

  useEffect(() => {
    // GSAP Hero Animation
    const ctx = gsap.context(() => {
      gsap.from('.hero-title', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });

      gsap.from('.hero-subtitle', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out',
      });

      gsap.from('.hero-search', {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: 0.6,
        ease: 'back.out(1.7)',
      });

      // Floating background elements
      gsap.to('.float-1', {
        y: -30,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      gsap.to('.float-2', {
        y: -20,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 0.5,
      });

      gsap.to('.float-3', {
        y: -25,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const [gainers, losers, traded, least, news] = await Promise.all([
          stockApi.getTopGainers(),
          stockApi.getTopLosers(),
          stockApi.getMostTraded(),
          stockApi.getLeastTraded(),
          stockApi.getStocksInNews(),
        ]);

        setTopGainers(gainers.data.data || []);
        setTopLosers(losers.data.data || []);
        setMostTraded(traded.data.data || []);
        setLeastTraded(least.data.data || []);
        setStocksInNews(news.data.data || []);
      } catch (error) {
        console.error('Error fetching market data:', error);
        // Set mock data for demo
        const mockStocks = [
          { symbol: 'AAPL', currentPrice: 178.50, changePercent: 2.5 },
          { symbol: 'GOOGL', currentPrice: 142.30, changePercent: 1.8 },
          { symbol: 'MSFT', currentPrice: 380.20, changePercent: 3.2 },
          { symbol: 'TSLA', currentPrice: 245.60, changePercent: -1.5 },
          { symbol: 'AMZN', currentPrice: 168.90, changePercent: 1.2 },
        ];
        setTopGainers(mockStocks);
        setTopLosers(mockStocks.map(s => ({ ...s, changePercent: -Math.abs(s.changePercent) })));
        setMostTraded(mockStocks);
        setLeastTraded(mockStocks);
        setStocksInNews(mockStocks);
      }
    };

    fetchMarketData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-4 py-20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="float-1 absolute top-20 left-10 w-64 h-64 bg-light-accent/20 dark:bg-dark-accent/20 rounded-full blur-3xl" />
          <div className="float-2 absolute bottom-20 right-10 w-96 h-96 bg-light-button/20 dark:bg-dark-accent/20 rounded-full blur-3xl" />
          <div className="float-3 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-light-accent/10 dark:bg-dark-card/30 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="p-4 bg-gradient-to-br from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text rounded-2xl">
              <TrendingUp className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <h1 className="hero-title text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-light-button via-light-accent to-light-button dark:from-dark-accent dark:via-dark-text dark:to-dark-accent bg-clip-text text-transparent">
            Stock Market Intelligence
          </h1>

          <p className="hero-subtitle text-xl md:text-2xl text-gray-700 dark:text-dark-text mb-12 max-w-3xl mx-auto">
            AI-powered predictions, real-time data, and artistic visualizations for the modern investor
          </p>

          <div className="hero-search max-w-3xl mx-auto">
            <SearchBar large />
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-12">
            {[
              { icon: Zap, text: 'AI Predictions' },
              { icon: BarChart3, text: 'Live Charts' },
              { icon: Shield, text: 'Secure' },
              { icon: Newspaper, text: 'News Feed' },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="flex items-center space-x-2 px-6 py-3 bg-white/50 dark:bg-dark-card/50 backdrop-blur-sm rounded-full"
              >
                <feature.icon className="w-5 h-5 text-light-button dark:text-dark-accent" />
                <span className="font-semibold text-gray-900 dark:text-dark-text">
                  {feature.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Market Widgets Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-dark-text"
        >
          Market Overview
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MarketWidget
            title="Top Gainers"
            stocks={topGainers}
            icon={TrendingUp}
            color="green"
          />
          <MarketWidget
            title="Top Losers"
            stocks={topLosers}
            icon={TrendingDown}
            color="red"
          />
          <MarketWidget
            title="Most Traded"
            stocks={mostTraded}
            icon={BarChart3}
            color="blue"
          />
          <MarketWidget
            title="Least Traded"
            stocks={leastTraded}
            icon={BarChart3}
            color="purple"
          />
          <MarketWidget
            title="Stocks in News"
            stocks={stocksInNews}
            icon={Newspaper}
            color="blue"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="card text-center bg-gradient-to-br from-light-button to-light-accent dark:from-dark-accent dark:to-dark-card p-12"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Level Up Your Trading?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get AI-powered predictions, premium insights, and exclusive market analysis
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-light-button dark:text-dark-bg px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
          >
            Explore Premium
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
