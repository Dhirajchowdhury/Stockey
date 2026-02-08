import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useThemeStore } from '../store/themeStore';

const StockChart = ({ data, symbol }) => {
  const { theme } = useThemeStore();
  const [timeframe, setTimeframe] = useState('1M');
  const [chartType, setChartType] = useState('area');

  const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

  const isDark = theme === 'dark';
  const gridColor = isDark ? '#456882' : '#ABE7B2';
  const lineColor = isDark ? '#D2C1B6' : '#93BFC7';
  const areaGradient = isDark ? ['#456882', '#234C6A'] : ['#ABE7B2', '#CBF3BB'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card p-3">
          <p className="text-sm font-semibold text-gray-900 dark:text-dark-text">
            ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {payload[0].payload.date}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text">
          {symbol} Price Chart
        </h3>
        
        <div className="flex space-x-2">
          {timeframes.map((tf) => (
            <motion.button
              key={tf}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                timeframe === tf
                  ? 'bg-light-button dark:bg-dark-accent text-white'
                  : 'bg-light-card dark:bg-dark-card text-gray-700 dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent/50'
              }`}
            >
              {tf}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex space-x-2 mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChartType('area')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            chartType === 'area'
              ? 'bg-light-button dark:bg-dark-accent text-white'
              : 'bg-light-card dark:bg-dark-card text-gray-700 dark:text-dark-text'
          }`}
        >
          Area
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setChartType('line')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            chartType === 'line'
              ? 'bg-light-button dark:bg-dark-accent text-white'
              : 'bg-light-card dark:bg-dark-card text-gray-700 dark:text-dark-text'
          }`}
        >
          Line
        </motion.button>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaGradient[0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={areaGradient[1]} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke={isDark ? '#D2C1B6' : '#1B3C53'}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={isDark ? '#D2C1B6' : '#1B3C53'}
              style={{ fontSize: '12px' }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.3} />
            <XAxis 
              dataKey="date" 
              stroke={isDark ? '#D2C1B6' : '#1B3C53'}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={isDark ? '#D2C1B6' : '#1B3C53'}
              style={{ fontSize: '12px' }}
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke={lineColor}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
