import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MarketWidget = ({ title, stocks, icon: Icon, color = 'blue' }) => {
  const navigate = useNavigate();

  const colorClasses = {
    green: 'from-green-500 to-emerald-500',
    red: 'from-red-500 to-rose-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="card"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text">
          {title}
        </h3>
      </div>

      <div className="space-y-3">
        {stocks?.slice(0, 5).map((stock, index) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(`/stocks/${stock.symbol}`)}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 cursor-pointer transition-all group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text flex items-center justify-center font-bold text-white">
                {stock.symbol.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-dark-text group-hover:text-light-button dark:group-hover:text-dark-accent transition-colors">
                  {stock.symbol}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  ${(stock.currentPrice || stock.price || 0).toFixed(2)}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`font-semibold ${
                  (stock.changePercent || 0) >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {(stock.changePercent || 0) >= 0 ? '+' : ''}
                {(stock.changePercent || 0).toFixed(2)}%
              </div>
              {(stock.changePercent || 0) >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 ml-auto" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400 ml-auto" />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {(!stocks || stocks.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No data available</p>
        </div>
      )}
    </motion.div>
  );
};

export default MarketWidget;
