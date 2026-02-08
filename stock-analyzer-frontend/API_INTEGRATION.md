# 🔌 API Integration Guide

## Backend API Endpoints Expected

This frontend expects the following REST API endpoints from your backend:

### Base URL
```
http://localhost:5000/api
```

Configure in `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📊 Stock Endpoints

### GET `/stocks`
Get all stocks with optional filters

**Query Params:**
- `filter` - 'gainers' | 'losers' | 'volume' | 'news'
- `limit` - Number of results
- `page` - Page number

**Response:**
```json
{
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 178.50,
      "change": 4.25,
      "changePercent": 2.44,
      "volume": 52000000,
      "marketCap": 2800000000000,
      "pe": 28.5,
      "high": 180.20,
      "low": 175.30
    }
  ]
}
```

### GET `/stocks/:symbol`
Get detailed information for a single stock

**Response:**
```json
{
  "data": {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "price": 178.50,
    "change": 4.25,
    "changePercent": 2.44,
    "volume": 52000000,
    "marketCap": 2800000000000,
    "pe": 28.5,
    "high": 180.20,
    "low": 175.30,
    "open": 176.80,
    "previousClose": 174.25,
    "yearHigh": 199.62,
    "yearLow": 124.17
  }
}
```

### GET `/stocks/:symbol/predictions`
Get AI predictions for a stock

**Response:**
```json
{
  "data": {
    "nextDay": {
      "price": 180.25,
      "confidence": 0.85,
      "direction": "up"
    },
    "nextWeek": {
      "price": 185.50,
      "confidence": 0.78,
      "direction": "up"
    },
    "nextMonth": {
      "price": 195.00,
      "confidence": 0.65,
      "direction": "up"
    }
  }
}
```

### GET `/stocks/movers/gainers`
Get top gaining stocks

**Response:**
```json
{
  "data": [
    {
      "symbol": "TSLA",
      "name": "Tesla Inc.",
      "price": 245.60,
      "changePercent": 8.5,
      "volume": 120000000
    }
  ]
}
```

### GET `/stocks/movers/losers`
Get top losing stocks (same format as gainers)

### GET `/stocks/movers/most-traded`
Get most traded stocks by volume

### GET `/stocks/movers/least-traded`
Get least traded stocks by volume

### GET `/stocks/news`
Get stocks currently in news

**Response:**
```json
{
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 178.50,
      "changePercent": 2.44,
      "newsCount": 15
    }
  ]
}
```

### GET `/stocks/:symbol/news`
Get news articles for a specific stock

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Apple announces new product line",
      "excerpt": "Apple Inc. today announced...",
      "url": "https://...",
      "source": "TechCrunch",
      "date": "2024-02-07T10:30:00Z",
      "sentiment": "positive"
    }
  ]
}
```

### GET `/stocks/:symbol/company`
Get company details

**Response:**
```json
{
  "data": {
    "description": "Apple Inc. designs, manufactures...",
    "ceo": "Tim Cook",
    "employees": 164000,
    "founded": 1976,
    "headquarters": "Cupertino, CA",
    "website": "https://www.apple.com",
    "industry": "Technology",
    "sector": "Consumer Electronics"
  }
}
```

### GET `/stocks/:symbol/peers`
Get peer comparison data

**Response:**
```json
{
  "data": [
    {
      "symbol": "GOOGL",
      "name": "Alphabet Inc.",
      "price": 142.30,
      "changePercent": 1.8,
      "marketCap": 1800000000000,
      "pe": 25.3
    }
  ]
}
```

### GET `/stocks/search?q=query`
Search stocks by symbol or name

**Query Params:**
- `q` - Search query

**Response:**
```json
{
  "data": [
    {
      "symbol": "AAPL",
      "name": "Apple Inc.",
      "price": 178.50,
      "changePercent": 2.44
    }
  ]
}
```

---

## 📝 Blog Endpoints

### GET `/blogs`
Get all blog posts

**Query Params:**
- `tag` - Filter by tag
- `limit` - Number of results
- `page` - Page number

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Understanding Stock Market Trends",
      "excerpt": "Learn about the latest market trends...",
      "content": "Full blog content...",
      "author": "John Doe",
      "date": "2024-02-07T10:00:00Z",
      "tags": ["market-analysis", "trading"],
      "image": "https://...",
      "readTime": "5 min read"
    }
  ]
}
```

### GET `/blogs/:id`
Get single blog post (same format as above)

---

## 🔐 Authentication Endpoints

### POST `/auth/login`
User login

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "avatar": "https://..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST `/auth/signup`
User registration

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as login

### POST `/auth/logout`
User logout (requires auth token)

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### GET `/auth/profile`
Get current user profile (requires auth token)

**Response:**
```json
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "avatar": "https://...",
    "subscription": "pro",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 💳 Subscription Endpoints

### GET `/subscriptions/plans`
Get available subscription plans

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Basic",
      "price": 9.99,
      "interval": "month",
      "features": [
        "Real-time stock data",
        "Basic AI predictions"
      ]
    }
  ]
}
```

### POST `/subscriptions/subscribe`
Subscribe to a plan (requires auth token)

**Request Body:**
```json
{
  "planId": 1,
  "paymentMethod": "card_token_here"
}
```

**Response:**
```json
{
  "data": {
    "subscriptionId": "sub_123",
    "status": "active",
    "currentPeriodEnd": "2024-03-07T00:00:00Z"
  }
}
```

### GET `/subscriptions/my`
Get user's subscriptions (requires auth token)

**Response:**
```json
{
  "data": [
    {
      "id": "sub_123",
      "plan": "Pro",
      "status": "active",
      "currentPeriodEnd": "2024-03-07T00:00:00Z"
    }
  ]
}
```

---

## 🔒 Authentication Headers

All authenticated requests must include:

```
Authorization: Bearer <token>
```

The frontend automatically adds this header via Axios interceptor.

---

## ⚠️ Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

### Common Error Codes

- `400` - Bad Request
- `401` - Unauthorized (triggers auto-logout)
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## 🧪 Testing Without Backend

The frontend includes mock data fallbacks for all API calls. If the backend is not available:

1. API calls will fail gracefully
2. Mock data will be displayed
3. Console will show error (for debugging)
4. User experience remains functional

Example in code:
```javascript
try {
  const response = await stockApi.getStocks();
  setStocks(response.data);
} catch (error) {
  console.error('API Error:', error);
  // Fallback to mock data
  setStocks(mockStocks);
}
```

---

## 🚀 Quick Backend Setup Checklist

To integrate with this frontend, your backend should:

- [ ] Implement all endpoints listed above
- [ ] Use JSON for request/response bodies
- [ ] Include CORS headers for frontend origin
- [ ] Implement JWT authentication
- [ ] Return consistent error format
- [ ] Support query parameters for filtering
- [ ] Include pagination for list endpoints
- [ ] Rate limit API calls
- [ ] Log all requests for debugging

---

## 📡 WebSocket Support (Future)

For real-time updates, consider adding WebSocket support:

```javascript
// Future implementation
const ws = new WebSocket('ws://localhost:5000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update stock prices in real-time
};
```

---

## 🔧 Environment Configuration

### Development
```env
VITE_API_URL=http://localhost:5000/api
```

### Production
```env
VITE_API_URL=https://api.yourdomain.com/api
```

---

## 📊 Rate Limiting

Frontend implements:
- Debounced search (300ms)
- React Query caching (5min)
- Automatic retry on failure (1 retry)

Backend should implement:
- Rate limiting per IP/user
- Throttling for expensive operations
- Caching for frequently accessed data

---

**This frontend is ready to integrate with any REST API that follows these specifications.**
