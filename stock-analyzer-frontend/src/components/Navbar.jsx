import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Moon, Sun, Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Stocks', path: '/stocks' },
    { name: 'Blogs & News', path: '/blogs' },
    { name: 'Premium', path: '/premium' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/70 dark:bg-dark-bg/70 backdrop-blur-xl shadow-lg'
          : 'bg-transparent'
      }`}
    >
      {/* Floating Bubbles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-2 left-20 w-16 h-16 bg-light-accent/10 dark:bg-dark-accent/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-4 right-40 w-20 h-20 bg-light-button/10 dark:bg-dark-accent/10 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            y: [0, -10, 0],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1 left-1/2 w-12 h-12 bg-light-accent/10 dark:bg-dark-text/10 rounded-full blur-xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group relative z-10">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="p-2 bg-gradient-to-br from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text rounded-xl shadow-lg"
            >
              <TrendingUp className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text bg-clip-text text-transparent">
              Stockey
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg text-gray-700 dark:text-dark-text hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 font-medium transition-colors relative group"
                >
                  {link.name}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-light-card/50 dark:bg-dark-card/50 backdrop-blur-sm hover:bg-light-accent/30 dark:hover:bg-dark-accent/30 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </motion.button>

            {/* Auth Buttons / Profile */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text text-white font-semibold shadow-lg"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline">{user?.name || 'User'}</span>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white/90 dark:bg-dark-card/90 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-light-accent/20 dark:border-dark-accent/20"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-lg font-semibold text-gray-700 dark:text-dark-text hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition-colors"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text text-white font-semibold shadow-lg"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-light-card/50 dark:bg-dark-card/50 backdrop-blur-sm"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-dark-text" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-dark-text" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl border-t border-light-accent/20 dark:border-dark-accent/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 rounded-lg text-gray-700 dark:text-dark-text hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 font-medium"
                  >
                    {link.name}
                  </motion.div>
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 space-y-2 border-t border-light-accent/20 dark:border-dark-accent/20">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-3 rounded-lg font-semibold text-gray-700 dark:text-dark-text bg-light-card dark:bg-dark-card">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text text-white font-semibold">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
