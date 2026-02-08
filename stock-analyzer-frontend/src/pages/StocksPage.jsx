import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search } from 'lucide-react';
import StockCard from '../components/StockCard';
import { stockApi } from '../api/stockApi';

const StocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: 'all', label: 'All Stocks' },
    { id: 'gainers', label: 'Top Gainers' },
    { id: 'losers', label: 'Top Losers' },
    { id: 'volume', label: 'High Volume' },
    { id: 'news', label: 'In News' },
  ];

  useEffect(() => {
    fetchStocks();
  }, [filter]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = stocks.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStocks(filtered);
    } else {
      setFilteredStocks(stocks);
    }
  }, [searchQuery, stocks]);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      let response;
      switch (filter) {
        case 'gainers':
          response = await stockApi.getTopGainers();
          break;
        case 'losers':
          response = await stockApi.getTopLosers();
          break;
        case 'volume':
          response = await stockApi.getMostTraded();
          break;
        case 'news':
          response = await stockApi.getStocksInNews();
          break;
        default:
          response = await stockApi.getStocks();
      }
      setStocks(response.data);
      setFilteredStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      // Mock data for demo
      const mockStocks = Array.from({ length: 20 }, (_, i) => ({
        symbol: `STOCK${i + 1}`,
        name: `Company ${i + 1}`,
        price: Math.random() * 500 + 50,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.random() * 10000000,
      }));
      setStocks(mockStocks);
      setFilteredStocks(mockStocks);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-dark-text mb-4">
            Explore Stocks
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Discover and analyze stocks with real-time data and AI insights
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by symbol or company name..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card rounded-xl shadow-lg focus:shadow-2xl focus:ring-2 focus:ring-light-button dark:focus:ring-dark-accent outline-none transition-all"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
            {filters.map((f) => (
              <motion.button
                key={f.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(f.id)}
                className={`px-6 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  filter === f.id
                    ? 'bg-light-button dark:bg-dark-accent text-white shadow-lg'
                    : 'bg-light-card dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent/50'
                }`}
              >
                {f.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-light-button dark:border-dark-accent border-t-transparent rounded-full"
            />
          </div>
        )}

        {/* Stocks Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredStocks.map((stock, index) => (
              <StockCard key={stock.symbol} stock={stock} index={index} />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredStocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2">
              No stocks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StocksPage;
