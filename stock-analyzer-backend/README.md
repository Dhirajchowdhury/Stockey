# 🚀 Stock Market Analyzer - Backend API

Production-grade backend with AI/ML capabilities for stock market analysis, predictions, and fintech SaaS features.

## 🎯 Overview

A secure, scalable Node.js backend that:
- Fetches and stores real-time stock data
- Analyzes news sentiment using NLP
- Generates AI-powered stock predictions (LSTM/Prophet/ARIMA concepts)
- Manages user authentication (JWT + Google OAuth)
- Handles premium subscriptions with role-based access
- Serves RESTful APIs with rate limiting and security

## 🏗️ Architecture

```
Backend Architecture
├── API Layer (Express.js)
│   ├── Authentication (JWT + OAuth 2.0)
│   ├── Rate Limiting
│   ├── Input Validation
│   └── Error Handling
│
├── Business Logic
│   ├── Stock Data Service
│   ├── News Service
│   ├── AI Prediction Service
│   └── Subscription Service
│
├── Data Layer (MongoDB)
│   ├── User Management
│   ├── Stock Data
│   ├── Price History
│   ├── News & Sentiment
│   ├── AI Predictions
│   └── Subscriptions
│
└── External Services
    ├── Stock Data API (Alpha Vantage)
    ├── News API
    ├── OpenAI (LLM explanations)
    └── Stripe (Payments - optional)
```

## 📦 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Passport.js (Google OAuth 2.0)
- **AI/ML**: OpenAI API, Custom algorithms (RSI, MACD, MA)
- **Security**: Helmet, CORS, Rate Limiting, bcrypt
- **Validation**: express-validator
- **File Upload**: Multer
- **Scheduling**: node-cron

## 🗃️ Database Schema

### User
```javascript
{
  name, email, password, role,
  provider, googleId,
  subscription: { tier, status, dates },
  watchlist: [symbols],
  preferences: { notifications, alerts }
}
```

### Stock
```javascript
{
  symbol, name, exchange, sector,
  currentPrice, volume, marketCap,
  change, changePercent,
  companyInfo, peers
}
```

### StockPriceHistory
```javascript
{
  symbol, date, interval,
  open, high, low, close, volume
}
```

### News
```javascript
{
  title, content, url, source,
  relatedStocks,
  sentiment: { score, label, confidence }
}
```

### Prediction
```javascript
{
  symbol, currentPrice,
  predictions: { nextDay, nextWeek, nextMonth },
  features: { RSI, MACD, volatility, sentiment },
  model: { type, version, accuracy },
  explanation: { summary, keyFactors, risks },
  accessLevel
}
```

### Blog
```javascript
{
  title, slug, content, author,
  tags, relatedStocks, category,
  status, isPremium
}
```

### PDF
```javascript
{
  title, filename, filePath,
  category, relatedStocks,
  accessLevel, downloads
}
```

### Subscription
```javascript
{
  user, plan, status,
  pricing: { amount, interval },
  billing: { stripe IDs },
  period: { start, end },
  features, usage
}
```

## 🔐 Authentication Flow

### Email/Password Registration
```
1. User submits: name, email, password
2. Validate input (email format, password strength)
3. Hash password with bcrypt (12 rounds)
4. Create user in database
5. Generate JWT access token (15min) + refresh token (7d)
6. Return tokens + user data
```

### Login
```
1. User submits: email, password
2. Find user by email
3. Compare password with bcrypt
4. Update lastLogin timestamp
5. Generate new tokens
6. Return tokens + user data
```

### Google OAuth 2.0
```
1. User clicks "Login with Google"
2. Redirect to Google OAuth consent screen
3. Google redirects back with authorization code
4. Exchange code for user profile
5. Check if user exists (by googleId or email)
6. Create or update user
7. Generate JWT tokens
8. Redirect to frontend with tokens
```

### Token Refresh
```
1. Client sends refresh token
2. Verify refresh token
3. Generate new access token
4. Return new access token
```

### Protected Routes
```
1. Client sends: Authorization: Bearer <access_token>
2. Middleware extracts and verifies token
3. Attach user to req.user
4. Check role/subscription if needed
5. Proceed to route handler
```

## 🤖 AI Prediction Pipeline

### Step 1: Data Collection
```javascript
- Fetch 90 days of historical price data
- Get recent news articles (20+)
- Calculate technical indicators
```

### Step 2: Feature Engineering
```javascript
Features:
- Moving Averages (MA7, MA30, MA90)
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Historical Volatility (30-day)
- Average Volume
- News Sentiment Score
```

### Step 3: Prediction Generation
```javascript
// Simplified model (replace with LSTM/Prophet in production)
1. Analyze trend (MA crossovers)
2. Check momentum (RSI, MACD)
3. Factor in volatility
4. Apply sentiment score
5. Generate predictions:
   - Next Day (high confidence)
   - Next Week (medium confidence)
   - Next Month (lower confidence)
```

### Step 4: LLM Explanation
```javascript
// Using OpenAI GPT-4
1. Format prediction data + indicators
2. Send to OpenAI API
3. Request structured explanation:
   - Summary (2-3 sentences)
   - Key factors (3 points)
   - Risks (2 points)
   - Opportunities (1 point)
4. Parse and store explanation
```

### Step 5: Storage & Caching
```javascript
- Save prediction to database
- Set expiration (6 hours)
- Return to client
- Reuse cached prediction if not expired
```

## 📊 Technical Indicators

### RSI (Relative Strength Index)
```javascript
// Measures momentum (0-100)
- < 30: Oversold (potential buy)
- > 70: Overbought (potential sell)
- 30-70: Neutral
```

### MACD (Moving Average Convergence Divergence)
```javascript
// Trend-following momentum indicator
- MACD Line = EMA(12) - EMA(26)
- Signal Line = EMA(9) of MACD
- Histogram = MACD - Signal
- Positive histogram: Bullish
- Negative histogram: Bearish
```

### Moving Averages
```javascript
// Smooth price data to identify trends
- MA7: Short-term trend
- MA30: Medium-term trend
- MA90: Long-term trend
- Golden Cross: MA7 > MA30 (bullish)
- Death Cross: MA7 < MA30 (bearish)
```

### Volatility
```javascript
// Annualized standard deviation of returns
- High volatility: Risky, unpredictable
- Low volatility: Stable, predictable
- Used to adjust confidence levels
```

## 🔒 Security Features

### Input Validation
- express-validator for all inputs
- Sanitize and normalize data
- Type checking and format validation

### Authentication Security
- bcrypt password hashing (12 rounds)
- JWT with short expiration (15min)
- Refresh tokens for session management
- Secure HTTP-only cookies (optional)

### API Security
- Helmet.js for security headers
- CORS with whitelist
- Rate limiting (per IP, per user)
- Request size limits (10MB)

### Database Security
- Mongoose schema validation
- Indexed queries for performance
- No sensitive data in responses
- Soft deletes (isActive flag)

### Role-Based Access Control
```javascript
Roles:
- user: Basic access
- admin: Full access

Subscription Tiers:
- free: Limited features
- basic: AI predictions
- pro: Advanced predictions
- elite: Full access + API
```

## 🚦 Rate Limiting

```javascript
// General API
- 100 requests per 15 minutes

// Authentication
- 5 attempts per 15 minutes

// AI Predictions
- Free: 10 per hour
- Pro/Elite: Unlimited

// Search
- 30 requests per minute

// File Upload
- 10 uploads per hour
```

## 📡 API Endpoints

### Authentication
```
POST   /api/v1/auth/register          Register new user
POST   /api/v1/auth/login             Login user
GET    /api/v1/auth/google            Google OAuth
GET    /api/v1/auth/google/callback   OAuth callback
POST   /api/v1/auth/refresh           Refresh token
POST   /api/v1/auth/logout            Logout
GET    /api/v1/auth/me                Get current user
PUT    /api/v1/auth/profile           Update profile
PUT    /api/v1/auth/password          Change password
```

### Stocks
```
GET    /api/v1/stocks                 Get all stocks
GET    /api/v1/stocks/search          Search stocks
GET    /api/v1/stocks/movers/gainers  Top gainers
GET    /api/v1/stocks/movers/losers   Top losers
GET    /api/v1/stocks/movers/most-traded
GET    /api/v1/stocks/movers/least-traded
GET    /api/v1/stocks/news            Stocks in news
GET    /api/v1/stocks/:symbol         Stock details
GET    /api/v1/stocks/:symbol/history Price history
GET    /api/v1/stocks/:symbol/company Company info
GET    /api/v1/stocks/:symbol/peers   Peer comparison
POST   /api/v1/stocks/:symbol/watchlist   Add to watchlist
DELETE /api/v1/stocks/:symbol/watchlist   Remove from watchlist
```

### Predictions (Premium)
```
GET    /api/v1/predictions/:symbol    Get prediction
POST   /api/v1/predictions/:symbol    Generate new
GET    /api/v1/predictions/:symbol/history
```

### News
```
GET    /api/v1/news                   Get all news
GET    /api/v1/news/:id               Get single news
GET    /api/v1/news/stock/:symbol     News for stock
```

### Blogs
```
GET    /api/v1/blogs                  Get all blogs
GET    /api/v1/blogs/:slug            Get single blog
POST   /api/v1/blogs                  Create blog (admin)
PUT    /api/v1/blogs/:id              Update blog (admin)
DELETE /api/v1/blogs/:id              Delete blog (admin)
```

### PDFs (Premium)
```
GET    /api/v1/pdfs                   Get all PDFs
GET    /api/v1/pdfs/:id               Get PDF details
GET    /api/v1/pdfs/:id/download      Download PDF
POST   /api/v1/pdfs                   Upload PDF (admin)
DELETE /api/v1/pdfs/:id               Delete PDF (admin)
```

### Subscriptions
```
GET    /api/v1/subscriptions/plans    Get plans
POST   /api/v1/subscriptions/subscribe
GET    /api/v1/subscriptions/my       My subscriptions
POST   /api/v1/subscriptions/cancel   Cancel subscription
```

## 🚀 Setup & Installation

### Prerequisites
```bash
- Node.js 18+
- MongoDB 6+
- npm or yarn
```

### Installation
```bash
# Clone repository
git clone <repo-url>
cd stock-analyzer-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Start MongoDB (if local)
mongod

# Run development server
npm run dev

# Run production server
npm start
```

### Environment Variables
```env
# Required
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-analyzer
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Optional but recommended
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
OPENAI_API_KEY=your-openai-key
STOCK_API_KEY=your-stock-api-key
NEWS_API_KEY=your-news-api-key
```

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": [ ... ]
  }
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Test specific endpoint
curl -X GET http://localhost:5000/api/v1/stocks/AAPL

# Test with authentication
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <your-token>"
```

## 📈 Performance Optimization

### Database
- Indexed queries on frequently accessed fields
- Compound indexes for complex queries
- Lean queries for read-only operations
- Connection pooling (max 10 connections)

### Caching
- Prediction caching (6 hours)
- Stock data caching (15 minutes)
- Redis integration (optional)

### API
- Pagination for large datasets
- Field selection (only return needed fields)
- Compression middleware
- Rate limiting to prevent abuse

## 🔄 Background Jobs (Cron)

```javascript
// Update stock prices every 15 minutes (market hours)
cron.schedule('*/15 9-16 * * 1-5', updateStockPrices);

// Fetch news every hour
cron.schedule('0 * * * *', fetchLatestNews);

// Analyze sentiment daily
cron.schedule('0 2 * * *', analyzeSentiment);

// Clean expired predictions daily
cron.schedule('0 3 * * *', cleanExpiredPredictions);

// Reset usage counters monthly
cron.schedule('0 0 1 * *', resetUsageCounters);
```

## 🐛 Error Codes

```
AUTH_001: Invalid credentials
AUTH_002: Token expired
AUTH_003: Unauthorized access
AUTH_004: Account inactive

STOCK_001: Stock not found
STOCK_002: Insufficient data
STOCK_003: API limit reached

PRED_001: Prediction failed
PRED_002: Premium required
PRED_003: Rate limit exceeded

SUB_001: Invalid subscription
SUB_002: Payment failed
SUB_003: Subscription expired
```

## 📊 Monitoring & Logging

```javascript
// Morgan for HTTP logging
// Winston for application logging (optional)
// Error tracking with Sentry (optional)
// Performance monitoring with New Relic (optional)
```

## 🚀 Deployment

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Use production MongoDB URI
- [ ] Set strong JWT secrets
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up CI/CD pipeline

### Deployment Options
- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS**: EC2 + RDS/DocumentDB
- **DigitalOcean**: Droplets + Managed MongoDB
- **Vercel/Netlify**: Serverless functions (requires adaptation)

## 📚 Additional Documentation

- API Documentation: `/docs/API.md`
- Database Schema: `/docs/SCHEMA.md`
- Security Guide: `/docs/SECURITY.md`
- Deployment Guide: `/docs/DEPLOYMENT.md`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

ISC

---

**Built for fintech SaaS with production-grade security and scalability**
