# 🔗 Frontend-Backend Integration Guide

## ✅ Integration Complete!

The frontend and backend are now fully integrated and ready to work together.

---

## 🚀 Quick Start (Both Services)

### Terminal 1: Start Backend
```bash
cd stock-analyzer-backend
npm run dev
```
Backend will run on: `http://localhost:5000`

### Terminal 2: Start Frontend
```bash
cd stock-analyzer-frontend
npm run dev
```
Frontend will run on: `http://localhost:5173`

---

## 🔧 Configuration

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-analyzer
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 📡 API Integration Details

### Authentication Flow

#### 1. Register/Login
```javascript
// Frontend sends
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "Password123"
}

// Backend responds
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}

// Frontend stores
- accessToken in Zustand store
- refreshToken in localStorage
- user data in Zustand store
```

#### 2. Authenticated Requests
```javascript
// Frontend automatically adds header
Authorization: Bearer <accessToken>

// Backend verifies token
- Extracts token from header
- Verifies with JWT_SECRET
- Attaches user to req.user
- Proceeds to route handler
```

#### 3. Token Refresh (Automatic)
```javascript
// When accessToken expires (15 min)
1. Frontend intercepts 401 error
2. Sends refreshToken to /auth/refresh
3. Backend returns new accessToken
4. Frontend retries original request
5. If refresh fails → logout user
```

### Stock Data Flow

```
User visits /stocks/AAPL
    ↓
Frontend: stockApi.getStock('AAPL')
    ↓
GET /api/v1/stocks/AAPL
    ↓
Backend: Stock.findOne({ symbol: 'AAPL' })
    ↓
Response: { success: true, data: { ... } }
    ↓
Frontend: Display stock data
```

### AI Prediction Flow

```
User requests prediction
    ↓
Frontend: predictionApi.getPrediction('AAPL')
    ↓
GET /api/v1/predictions/AAPL
    ↓
Backend: Check subscription tier
    ↓
Backend: Check cached prediction
    ↓
If no cache: Generate new prediction
    - Fetch historical data
    - Calculate indicators
    - Run ML model
    - Generate LLM explanation
    - Cache for 6 hours
    ↓
Response: { success: true, data: { predictions, explanation } }
    ↓
Frontend: Display prediction
```

---

## 🔐 Authentication States

### Not Logged In
- Can view: Stocks, Blogs, Landing page
- Cannot view: Predictions, Premium content, Watchlist
- Navbar shows: Login, Sign Up buttons

### Logged In (Free Tier)
- Can view: All public content
- Cannot view: AI predictions, Premium PDFs
- Navbar shows: Profile dropdown

### Logged In (Basic+ Tier)
- Can view: AI predictions
- Can access: Basic premium content
- Navbar shows: Profile dropdown

### Logged In (Pro/Elite Tier)
- Can view: All content
- Can generate: New predictions
- Can access: All premium features

---

## 📊 Data Format Mapping

### Stock Object
```javascript
// Backend sends
{
  symbol: "AAPL",
  name: "Apple Inc.",
  currentPrice: 178.50,
  change: 4.25,
  changePercent: 2.44,
  volume: 52000000,
  marketCap: 2800000000000,
  peRatio: 28.5,
  dayHigh: 180.20,
  dayLow: 175.30
}

// Frontend uses
- currentPrice for display
- changePercent for trend indicators
- All fields are compatible
```

### Prediction Object
```javascript
// Backend sends
{
  predictions: {
    nextDay: {
      price: 180.25,
      confidence: 0.85,
      direction: "up"
    },
    nextWeek: { ... },
    nextMonth: { ... }
  },
  explanation: {
    summary: "...",
    keyFactors: [...],
    risks: [...],
    opportunities: [...]
  }
}

// Frontend displays
- Price predictions with confidence bars
- Direction indicators (up/down arrows)
- LLM explanation in readable format
```

---

## 🧪 Testing Integration

### 1. Test Backend Health
```bash
curl http://localhost:5000/health
```

Expected:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 2. Test Registration
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

### 3. Test Login from Frontend
1. Open `http://localhost:5173`
2. Click "Login"
3. Enter credentials
4. Should redirect to home with profile icon

### 4. Test Stock Data
1. Visit `http://localhost:5173/stocks`
2. Should see stock list (or mock data if no DB data)
3. Click a stock
4. Should see stock details

### 5. Test AI Predictions (Requires Auth + Subscription)
1. Login with account
2. Visit stock detail page
3. Should see predictions section
4. If no subscription: Shows upgrade message
5. If has subscription: Shows actual predictions

---

## 🔄 Error Handling

### Frontend Handles
- Network errors
- API errors
- Token expiration
- Subscription tier errors
- Validation errors

### Backend Handles
- Invalid requests
- Database errors
- External API failures
- Authentication failures
- Authorization failures

### Error Flow
```
Error occurs in backend
    ↓
Backend formats error
{
  "success": false,
  "error": {
    "message": "User-friendly message",
    "code": "ERROR_CODE"
  }
}
    ↓
Frontend catches error
    ↓
Display to user
- Toast notification
- Error message on page
- Fallback to mock data (if applicable)
```

---

## 🎯 Common Integration Scenarios

### Scenario 1: User Registers
```
1. User fills registration form
2. Frontend: authApi.register(userData)
3. Backend: Creates user, hashes password
4. Backend: Returns tokens
5. Frontend: Stores tokens, redirects to home
6. User is now logged in
```

### Scenario 2: User Views Stock
```
1. User clicks stock card
2. Frontend: Navigate to /stocks/AAPL
3. Frontend: stockApi.getStock('AAPL')
4. Backend: Fetches from DB or external API
5. Backend: Returns stock data
6. Frontend: Displays stock details
```

### Scenario 3: User Requests Prediction
```
1. User on stock detail page
2. Frontend: predictionApi.getPrediction('AAPL')
3. Backend: Checks auth token
4. Backend: Checks subscription tier
5. If authorized:
   - Check cache
   - Generate if needed
   - Return prediction
6. If not authorized:
   - Return 403 error
   - Frontend shows upgrade prompt
```

### Scenario 4: Token Expires
```
1. User makes API request
2. Backend: Token expired (401)
3. Frontend: Intercepts 401
4. Frontend: Sends refresh token
5. Backend: Validates refresh token
6. Backend: Returns new access token
7. Frontend: Retries original request
8. Request succeeds
```

---

## 🐛 Troubleshooting

### CORS Error
```
Error: Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution**: Check backend CORS configuration
```javascript
// backend/src/server.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### 401 Unauthorized
```
Error: Not authorized to access this route
```

**Solutions**:
1. Check if user is logged in
2. Verify token is being sent
3. Check token expiration
4. Try logging out and back in

### 403 Forbidden (Premium Required)
```
Error: This feature requires pro subscription
```

**Solution**: This is expected behavior
- Feature requires higher subscription tier
- Frontend should show upgrade prompt
- User needs to subscribe

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5000
```

**Solution**: Backend not running
```bash
cd stock-analyzer-backend
npm run dev
```

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: MongoDB not running
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in backend/.env
```

---

## 📈 Performance Optimization

### Frontend
- React Query caching (5 min)
- Debounced search (300ms)
- Lazy loading images
- Code splitting

### Backend
- Prediction caching (6 hours)
- Database indexing
- Connection pooling
- Rate limiting

### Together
- Minimize API calls
- Use cached data when possible
- Pagination for large datasets
- Optimistic UI updates

---

## 🔒 Security Checklist

- [x] HTTPS in production
- [x] JWT tokens with short expiration
- [x] Refresh token rotation
- [x] Password hashing (bcrypt)
- [x] Input validation
- [x] Rate limiting
- [x] CORS configuration
- [x] Security headers (Helmet)
- [x] SQL injection prevention
- [x] XSS prevention

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd stock-analyzer-frontend
npm run build

# Deploy dist/ folder
# Set environment variable:
VITE_API_URL=https://api.yourdomain.com/api/v1
```

### Backend (Heroku/Railway/DigitalOcean)
```bash
cd stock-analyzer-backend

# Set environment variables:
NODE_ENV=production
MONGODB_URI_PROD=mongodb+srv://...
JWT_SECRET=<strong-secret>
FRONTEND_URL_PROD=https://yourdomain.com

# Deploy
git push heroku main
```

---

## 📚 API Endpoint Reference

### Public Endpoints (No Auth Required)
```
GET  /api/v1/stocks
GET  /api/v1/stocks/:symbol
GET  /api/v1/stocks/search
GET  /api/v1/stocks/movers/gainers
GET  /api/v1/stocks/movers/losers
GET  /api/v1/blogs
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### Protected Endpoints (Auth Required)
```
GET  /api/v1/auth/me
POST /api/v1/auth/logout
GET  /api/v1/predictions/:symbol (Basic+)
POST /api/v1/predictions/:symbol (Pro+)
GET  /api/v1/stocks/watchlist/my
POST /api/v1/stocks/:symbol/watchlist
```

### Admin Endpoints
```
POST /api/v1/blogs
PUT  /api/v1/blogs/:id
POST /api/v1/pdfs
GET  /api/v1/users
```

---

## ✨ Features Working

### ✅ Fully Integrated
- User registration & login
- JWT authentication with refresh
- Stock data display
- Search functionality
- Market movers
- Stock details
- Price history charts
- Theme toggle (dark/light)
- Responsive design

### ⚠️ Requires Setup
- AI predictions (needs OpenAI API key)
- News feed (needs News API key)
- Real stock data (needs Alpha Vantage key)
- Google OAuth (needs Google credentials)
- Subscriptions (needs Stripe setup)

### 🔄 Mock Data Fallback
- If backend APIs not configured
- Frontend shows mock data
- All features remain functional
- Good for development/demo

---

## 🎉 You're All Set!

Your frontend and backend are now fully integrated and working together!

**Next Steps**:
1. Start both services
2. Test registration/login
3. Browse stocks
4. Configure external APIs (optional)
5. Deploy to production

**Need Help?**
- Check backend logs: `npm run dev` output
- Check frontend console: Browser DevTools
- Review API responses: Network tab
- Test endpoints: Postman/curl

---

**Happy coding! 🚀**
