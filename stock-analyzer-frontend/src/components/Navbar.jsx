import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, User, LogOut, Settings, Star, Moon, Sun, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Stocks', path: '/stocks' },
    { name: 'Blogs & News', path: '/blogs' },
    { name: 'Premium', path: '/premium' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg border-b border-light-accent/20 dark:border-dark-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <TrendingUp className="w-8 h-8 text-light-button dark:text-dark-accent" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text bg-clip-text text-transparent">
              StockVibe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 dark:text-dark-text hover:text-light-button dark:hover:text-dark-accent font-medium transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-light-button dark:bg-dark-accent group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-light-card dark:bg-dark-card"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </motion.button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-2 rounded-lg bg-light-card dark:bg-dark-card"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-light-button to-light-accent dark:from-dark-accent dark:to-dark-text flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 card py-2"
                    >
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-light-accent/20 dark:hover:bg-dark-accent/20"
                        onClick={() => setShowDropdown(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/my-stocks"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-light-accent/20 dark:hover:bg-dark-accent/20"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Star className="w-4 h-4" />
                        <span>My Stocks</span>
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-light-accent/20 dark:hover:bg-dark-accent/20"
                        onClick={() => setShowDropdown(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <hr className="my-2 border-light-accent/20 dark:border-dark-accent/20" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-red-500/20 text-red-600 dark:text-red-400 w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2"
          >
            {showMobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-light-accent/20 dark:border-dark-accent/20"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block py-2 text-gray-700 dark:text-dark-text hover:text-light-button dark:hover:text-dark-accent"
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Link to="/login" onClick={() => setShowMobileMenu(false)}>
                    <button className="btn-secondary w-full">Login</button>
                  </Link>
                  <Link to="/signup" onClick={() => setShowMobileMenu(false)}>
                    <button className="btn-primary w-full">Sign Up</button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
