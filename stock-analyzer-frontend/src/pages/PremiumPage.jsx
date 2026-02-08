import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const PremiumPage = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const plans = [
    {
      name: 'Basic',
      price: 9.99,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Real-time stock data',
        'Basic AI predictions',
        'Market news feed',
        'Up to 10 watchlist stocks',
        'Email alerts',
      ],
    },
    {
      name: 'Pro',
      price: 29.99,
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      popular: true,
      features: [
        'Everything in Basic',
        'Advanced AI predictions',
        'Peer comparison analysis',
        'Unlimited watchlist',
        'Priority support',
        'Quarterly reports access',
        'Custom alerts',
      ],
    },
    {
      name: 'Elite',
      price: 99.99,
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      features: [
        'Everything in Pro',
        'Institutional-grade AI',
        'Portfolio optimization',
        'Risk analysis tools',
        'Dedicated account manager',
        'API access',
        'White-label reports',
        'Early feature access',
      ],
    },
  ];

  const handleSubscribe = (plan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Handle subscription logic
    console.log('Subscribe to:', plan);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6"
          >
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Sparkles className="w-16 h-16 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-light-button via-light-accent to-light-button dark:from-dark-accent dark:via-dark-text dark:to-dark-accent bg-clip-text text-transparent">
            Unlock Premium Features
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Get access to advanced AI predictions, exclusive reports, and institutional-grade analytics
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className={`card relative ${plan.popular ? 'ring-4 ring-light-button dark:ring-dark-accent' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`p-4 rounded-xl bg-gradient-to-br ${plan.color} mb-6`}>
                <plan.icon className="w-12 h-12 text-white" />
              </div>

              <h3 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-2">
                {plan.name}
              </h3>

              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-dark-text">
                  ${plan.price}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-start space-x-3"
                  >
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubscribe(plan.name)}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-2xl'
                    : 'bg-light-button dark:bg-dark-accent text-white hover:shadow-xl'
                }`}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Premium Features Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card bg-gradient-to-br from-light-button/10 to-light-accent/10 dark:from-dark-accent/10 dark:to-dark-card/50"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text mb-8 text-center">
            Why Go Premium?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Sparkles,
                title: 'AI Predictions',
                description: 'Advanced machine learning models for accurate forecasts',
              },
              {
                icon: TrendingUp,
                title: 'Real-time Data',
                description: 'Live market data with zero delay',
              },
              {
                icon: Zap,
                title: 'Fast Execution',
                description: 'Lightning-fast analysis and alerts',
              },
              {
                icon: Crown,
                title: 'Premium Support',
                description: '24/7 dedicated support team',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-block p-4 bg-gradient-to-br from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text rounded-2xl mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumPage;
