import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { stockApi } from '../api/stockApi';

const SearchBar = ({ large = false }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchStocks = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await stockApi.searchStocks(query);
        setResults(response.data.slice(0, 5));
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (symbol) => {
    navigate(`/stocks/${symbol}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <motion.div
        initial={large ? { scale: 0.9, opacity: 0 } : {}}
        animate={large ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.5 }}
        className={`relative ${large ? 'max-w-2xl mx-auto' : ''}`}
      >
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 ${large ? 'w-6 h-6' : 'w-5 h-5'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks by name or symbol..."
            className={`w-full ${large ? 'pl-14 pr-6 py-5 text-lg' : 'pl-12 pr-4 py-3'} bg-white dark:bg-dark-card rounded-2xl shadow-lg focus:shadow-2xl focus:ring-2 focus:ring-light-button dark:focus:ring-dark-accent outline-none transition-all duration-300`}
          />
          {loading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-light-button dark:border-dark-accent border-t-transparent rounded-full"
              />
            </div>
          )}
        </div>

        <AnimatePresence>
          {isOpen && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute w-full mt-2 card py-2 z-50"
            >
              {results.map((stock, index) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelect(stock.symbol)}
                  className="flex items-center justify-between px-4 py-3 hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-dark-text">
                        {stock.symbol}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {stock.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 dark:text-dark-text">
                      ${stock.price?.toFixed(2) || 'N/A'}
                    </div>
                    {stock.changePercent && (
                      <div
                        className={`text-sm ${
                          stock.changePercent >= 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {stock.changePercent >= 0 ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SearchBar;
