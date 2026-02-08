import api from './axios';

export const stockApi = {
  // Get all stocks
  getStocks: (params) => api.get('/stocks', { params }),
  
  // Get single stock details
  getStock: (symbol) => api.get(`/stocks/${symbol}`),
  
  // Get stock price history
  getStockHistory: (symbol, params) => api.get(`/stocks/${symbol}/history`, { params }),
  
  // Get market movers
  getTopGainers: () => api.get('/stocks/movers/gainers'),
  getTopLosers: () => api.get('/stocks/movers/losers'),
  getMostTraded: () => api.get('/stocks/movers/most-traded'),
  getLeastTraded: () => api.get('/stocks/movers/least-traded'),
  
  // Get stocks in news
  getStocksInNews: () => api.get('/stocks/news'),
  
  // Get company details
  getCompanyDetails: (symbol) => api.get(`/stocks/${symbol}/company`),
  
  // Get peer comparison
  getPeerComparison: (symbol) => api.get(`/stocks/${symbol}/peers`),
  
  // Search stocks
  searchStocks: (query) => api.get('/stocks/search', { params: { q: query } }),
  
  // Watchlist
  addToWatchlist: (symbol) => api.post(`/stocks/${symbol}/watchlist`),
  removeFromWatchlist: (symbol) => api.delete(`/stocks/${symbol}/watchlist`),
  getWatchlist: () => api.get('/stocks/watchlist/my'),
};

export const predictionApi = {
  // Get AI prediction for a stock (requires Basic+ subscription)
  getPrediction: (symbol) => api.get(`/predictions/${symbol}`),
  
  // Generate new prediction (requires Pro+ subscription)
  generatePrediction: (symbol) => api.post(`/predictions/${symbol}`),
  
  // Get prediction history (requires Elite subscription)
  getPredictionHistory: (symbol) => api.get(`/predictions/${symbol}/history`),
};

export const newsApi = {
  // Get all news
  getNews: (params) => api.get('/news', { params }),
  
  // Get single news article
  getNewsById: (id) => api.get(`/news/${id}`),
  
  // Get news for specific stock
  getStockNews: (symbol) => api.get(`/news/stock/${symbol}`),
};

export const blogApi = {
  // Get all blogs
  getBlogs: (params) => api.get('/blogs', { params }),
  
  // Get single blog by slug
  getBlog: (slug) => api.get(`/blogs/${slug}`),
  
  // Create blog (admin only)
  createBlog: (data) => api.post('/blogs', data),
  
  // Update blog (admin only)
  updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
  
  // Delete blog (admin only)
  deleteBlog: (id) => api.delete(`/blogs/${id}`),
};

export const pdfApi = {
  // Get all PDFs
  getPdfs: (params) => api.get('/pdfs', { params }),
  
  // Get PDF details
  getPdf: (id) => api.get(`/pdfs/${id}`),
  
  // Download PDF (requires appropriate subscription)
  downloadPdf: (id) => api.get(`/pdfs/${id}/download`, { responseType: 'blob' }),
  
  // Upload PDF (admin only)
  uploadPdf: (formData) => api.post('/pdfs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Delete PDF (admin only)
  deletePdf: (id) => api.delete(`/pdfs/${id}`),
};

export const authApi = {
  // Register new user
  register: (userData) => api.post('/auth/register', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Logout user
  logout: () => api.post('/auth/logout'),
  
  // Get current user profile
  getProfile: () => api.get('/auth/me'),
  
  // Update user profile
  updateProfile: (data) => api.put('/auth/profile', data),
  
  // Change password
  changePassword: (data) => api.put('/auth/password', data),
  
  // Refresh access token
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  
  // Google OAuth (redirect to backend)
  googleAuth: () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  },
};

export const subscriptionApi = {
  // Get available subscription plans
  getPlans: () => api.get('/subscriptions/plans'),
  
  // Subscribe to a plan
  subscribe: (planId, paymentMethod) => api.post('/subscriptions/subscribe', { 
    planId, 
    paymentMethod 
  }),
  
  // Get user's subscriptions
  getMySubscriptions: () => api.get('/subscriptions/my'),
  
  // Cancel subscription
  cancelSubscription: (reason) => api.post('/subscriptions/cancel', { reason }),
};

export const userApi = {
  // Get all users (admin only)
  getUsers: (params) => api.get('/users', { params }),
  
  // Get user by ID (admin only)
  getUser: (id) => api.get(`/users/${id}`),
  
  // Update user (admin only)
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  
  // Delete user (admin only)
  deleteUser: (id) => api.delete(`/users/${id}`),
};
