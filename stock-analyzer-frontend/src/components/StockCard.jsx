import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StockCard = ({ stock, index = 0 }) => {
  const navigate = useNavigate();
  const isPositive = (stock.change || stock.changePercent) >= 0;
  const price = stock.currentPrice || stock.price || 0;
  const change = stock.change || 0;
  const changePercent = stock.changePercent || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      onClick={() => navigate(`/stocks/${stock.symbol}`)}
      className="card cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text">
            {stock.symbol}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stock.name}
          </p>
        </div>
        <motion.div
          animate={{ rotate: isPositive ? 0 : 180 }}
          className={`p-2 rounded-lg ${
            isPositive
              ? 'bg-green-100 dark:bg-green-900/30'
              : 'bg-red-100 dark:bg-red-900/30'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
          ) : (
            <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
          )}
        </motion.div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-3xl font-bold text-gray-900 dark:text-dark-text">
            ${price.toFixed(2)}
          </span>
          <div className="text-right">
            <div
              className={`text-lg font-semibold ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isPositive ? '+' : ''}
              {change.toFixed(2)}
            </div>
            <div
              className={`text-sm ${
                isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}
            >
              {isPositive ? '+' : ''}
              {changePercent.toFixed(2)}%
            </div>
          </div>
        </div>

        {stock.volume && (
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-light-accent/20 dark:border-dark-accent/20">
            <span>Volume</span>
            <span className="font-semibold">
              {(stock.volume / 1000000).toFixed(2)}M
            </span>
          </div>
        )}
      </div>

      <motion.div
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        className="h-1 bg-gradient-to-r from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text rounded-full mt-4"
      />
    </motion.div>
  );
};

export default StockCard;
