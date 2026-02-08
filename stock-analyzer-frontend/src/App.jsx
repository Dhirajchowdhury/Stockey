import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import StocksPage from './pages/StocksPage';
import StockDetailPage from './pages/StockDetailPage';
import BlogsPage from './pages/BlogsPage';
import PremiumPage from './pages/PremiumPage';
import LoginPage from './pages/LoginPage';
import { useThemeStore } from './store/themeStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-light-bg dark:bg-dark-bg transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/stocks" element={<StocksPage />} />
            <Route path="/stocks/:symbol" element={<StockDetailPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<LoginPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
