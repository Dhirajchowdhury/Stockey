# 🚀 Quick Start Guide - Stock Analyzer Backend

## Prerequisites

- **Node.js** 18+ installed
- **MongoDB** 6+ installed and running
- **npm** or **yarn** package manager
- API keys (optional for full functionality):
  - Alpha Vantage (stock data)
  - News API (news data)
  - OpenAI (AI explanations)
  - Google OAuth credentials

## 📦 Installation

### 1. Install Dependencies

```bash
cd stock-analyzer-backend
npm install
```

### 2. Setup Environment Variables

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Minimum required for local development
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-analyzer
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env with your Atlas connection string
```

### 4. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

## ✅ Verify Installation

### Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-02-07T...",
  "environment": "development"
}
```

## 🧪 Test API Endpoints

### 1. Register a User

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 3. Get Current User (Protected Route)

```bash
# Replace <TOKEN> with your accessToken from login
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

### 4. Get Stocks (Public Route)

```bash
curl -X GET http://localhost:5000/api/v1/stocks
```

## 🎯 Next Steps

### Add Mock Stock Data

Create a seed script or manually add stocks to MongoDB:

```javascript
// In MongoDB shell or Compass
db.stocks.insertMany([
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    currentPrice: 178.50,
    change: 4.25,
    changePercent: 2.44,
    volume: 52000000,
    marketCap: 2800000000000,
    isActive: true,
    lastUpdated: new Date()
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    currentPrice: 142.30,
    change: 2.50,
    changePercent: 1.79,
    volume: 28000000,
    marketCap: 1800000000000,
    isActive: true,
    lastUpdated: new Date()
  }
]);
```

### Setup External APIs (Optional)

#### Alpha Vantage (Stock Data)
1. Get free API key: https://www.alphavantage.co/support/#api-key
2. Add to `.env`: `STOCK_API_KEY=your-key`

#### News API
1. Get free API key: https://newsapi.org/register
2. Add to `.env`: `NEWS_API_KEY=your-key`

#### OpenAI (AI Predictions)
1. Get API key: https://platform.openai.com/api-keys
2. Add to `.env`: `OPENAI_API_KEY=your-key`

#### Google OAuth
1. Go to: https://console.cloud.google.com/
2. Create project and OAuth 2.0 credentials
3. Add to `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/google` | Google OAuth | Public |
| POST | `/auth/refresh` | Refresh token | Public |
| POST | `/auth/logout` | Logout user | Private |
| GET | `/auth/me` | Get current user | Private |
| PUT | `/auth/profile` | Update profile | Private |
| PUT | `/auth/password` | Change password | Private |

### Stock Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stocks` | Get all stocks | Public |
| GET | `/stocks/search?q=AAPL` | Search stocks | Public |
| GET | `/stocks/movers/gainers` | Top gainers | Public |
| GET | `/stocks/movers/losers` | Top losers | Public |
| GET | `/stocks/:symbol` | Stock details | Public |
| GET | `/stocks/:symbol/history` | Price history | Public |
| GET | `/stocks/:symbol/company` | Company info | Public |
| GET | `/stocks/:symbol/peers` | Peer comparison | Public |

### Prediction Endpoints (Premium)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/predictions/:symbol` | Get prediction | Private (Basic+) |
| POST | `/predictions/:symbol` | Generate new | Private (Pro+) |

## 🔐 Authentication Flow

### Using Access Token

```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234"}' \
  | jq -r '.data.accessToken')

# 2. Use token in subsequent requests
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Token Refresh

```bash
# When access token expires (15 minutes)
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<your-refresh-token>"}'
```

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Start MongoDB
```bash
# macOS/Linux
sudo systemctl start mongod

# Windows
net start MongoDB

# Or use MongoDB Atlas (cloud)
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution**: Change port in `.env` or kill process
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change PORT in .env
PORT=5001
```

### JWT Secret Error

```
Error: secretOrPrivateKey must have a value
```

**Solution**: Set JWT secrets in `.env`
```env
JWT_SECRET=your-secret-key-at-least-32-characters-long
JWT_REFRESH_SECRET=your-refresh-secret-key-at-least-32-characters-long
```

### CORS Error

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Update `FRONTEND_URL` in `.env`
```env
FRONTEND_URL=http://localhost:5173
```

## 📊 Database Management

### View Data (MongoDB Compass)

1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `stock-analyzer`
4. Browse collections

### MongoDB Shell

```bash
# Connect to database
mongosh

# Use database
use stock-analyzer

# View collections
show collections

# Query users
db.users.find().pretty()

# Query stocks
db.stocks.find().pretty()

# Count documents
db.users.countDocuments()
```

## 🧪 Testing with Postman

1. Import collection (create from API docs)
2. Set environment variables:
   - `baseUrl`: `http://localhost:5000/api/v1`
   - `accessToken`: (set after login)
3. Test endpoints

## 🚀 Production Deployment

### Environment Setup

```env
NODE_ENV=production
PORT=5000
MONGODB_URI_PROD=mongodb+srv://user:pass@cluster.mongodb.net/stock-analyzer
JWT_SECRET=<strong-secret-64-chars>
JWT_REFRESH_SECRET=<strong-secret-64-chars>
FRONTEND_URL_PROD=https://yourdomain.com
```

### Build & Start

```bash
# No build step needed for Node.js
npm start
```

### Deployment Platforms

#### Heroku
```bash
heroku create stock-analyzer-api
heroku addons:create mongolab
git push heroku main
```

#### DigitalOcean
```bash
# Use App Platform or Droplet
# Configure environment variables in dashboard
```

#### AWS EC2
```bash
# SSH into instance
# Install Node.js and MongoDB
# Clone repo and run
```

## 📝 Development Tips

### Auto-restart on Changes

```bash
# Already configured with nodemon
npm run dev
```

### View Logs

```bash
# Development logs are in console
# Production: use PM2 or similar
pm2 logs
```

### Database Seeding

Create `src/seeds/seedData.js`:
```javascript
import Stock from './models/Stock.js';

const seedStocks = async () => {
  await Stock.insertMany([...]);
};
```

## 🔧 Common Tasks

### Create Admin User

```javascript
// In MongoDB shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

### Reset User Password

```javascript
// In MongoDB shell
const bcrypt = require('bcryptjs');
const newPassword = await bcrypt.hash('NewPassword123', 12);

db.users.updateOne(
  { email: "user@example.com" },
  { $set: { password: newPassword } }
)
```

### Clear All Data

```javascript
// In MongoDB shell
db.dropDatabase()
```

## 📚 Additional Resources

- Full API Documentation: `README.md`
- Database Schema: Check model files in `src/models/`
- Security Guide: Review middleware in `src/middleware/`

## 🎉 You're Ready!

Your backend is now running and ready to integrate with the frontend!

Test the integration:
1. Start backend: `npm run dev` (port 5000)
2. Start frontend: `cd ../stock-analyzer-frontend && npm run dev` (port 5173)
3. Open browser: `http://localhost:5173`
4. Register/Login and test features

---

**Need help? Check the main README.md for detailed documentation.**
