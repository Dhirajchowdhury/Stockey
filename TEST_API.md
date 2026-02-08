# API Integration Test Results

## Backend Health Check
```bash
curl http://localhost:5000/health
```

## Test Authentication Endpoints

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Get User Profile (requires token)
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Test Stock Endpoints

### 1. Get All Stocks
```bash
curl http://localhost:5000/api/v1/stocks
```

### 2. Search Stocks
```bash
curl "http://localhost:5000/api/v1/stocks/search?q=AAPL"
```

### 3. Get Stock Details
```bash
curl http://localhost:5000/api/v1/stocks/AAPL
```

### 4. Get Top Gainers
```bash
curl http://localhost:5000/api/v1/stocks/movers/gainers
```

### 5. Get Top Losers
```bash
curl http://localhost:5000/api/v1/stocks/movers/losers
```

## Test News Endpoints

### 1. Get All News
```bash
curl http://localhost:5000/api/v1/news
```

### 2. Get Stock News
```bash
curl http://localhost:5000/api/v1/news/stock/AAPL
```

## Test Blog Endpoints

### 1. Get All Blogs
```bash
curl http://localhost:5000/api/v1/blogs
```

## Test Prediction Endpoints (requires authentication)

### 1. Get Prediction
```bash
curl http://localhost:5000/api/v1/predictions/AAPL \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Integration Tests

### 1. Open Frontend
```
http://localhost:5173
```

### 2. Test Registration
1. Click "Sign Up"
2. Fill in form
3. Submit
4. Check if redirected to home

### 3. Test Login
1. Click "Login"
2. Enter credentials
3. Submit
4. Check if profile icon appears

### 4. Test Stock Search
1. Type stock symbol in search bar
2. Check if results appear
3. Click on a stock
4. Verify stock detail page loads

### 5. Test Theme Toggle
1. Click theme toggle button
2. Verify dark/light mode switches

## Common Issues and Solutions

### Issue: CORS Error
**Solution**: Check backend .env has correct FRONTEND_URL

### Issue: 401 Unauthorized
**Solution**: Make sure you're logged in and token is valid

### Issue: Connection Refused
**Solution**: Make sure both servers are running

### Issue: MongoDB Connection Error
**Solution**: Start MongoDB with `mongod` command
