# ⚡ Quick Reference Card

## 🚀 Start Commands

```bash
# Backend (Terminal 1)
cd stock-analyzer-backend
npm run dev

# Frontend (Terminal 2)
cd stock-analyzer-frontend
npm run dev
```

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Health**: http://localhost:5000/health

## 📁 Key Files

```
Project Root
├── START_HERE.md              ← Read this first!
├── README.md                  ← Project overview
├── INTEGRATION_GUIDE.md       ← How it works
├── start-dev.bat             ← Windows auto-start
│
├── stock-analyzer-backend/
│   ├── .env                   ← Backend config (create this!)
│   ├── src/server.js          ← Entry point
│   └── README.md              ← Backend docs
│
└── stock-analyzer-frontend/
    ├── .env                   ← Frontend config (create this!)
    ├── src/App.jsx            ← Entry point
    └── README.md              ← Frontend docs
```

## 🔧 Environment Setup

### Backend `.env`
```env
MONGODB_URI=mongodb://localhost:27017/stock-analyzer
JWT_SECRET=your-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 🧪 Quick Tests

```bash
# Test backend
curl http://localhost:5000/health

# Test frontend
# Open http://localhost:5173 in browser

# Test registration
# Click "Sign Up" → Fill form → Submit
```

## 🐛 Common Fixes

| Problem | Solution |
|---------|----------|
| MongoDB error | Run `mongod` |
| Port in use | Change PORT in .env |
| CORS error | Check FRONTEND_URL |
| 401 error | Logout and login again |
| Module not found | Run `npm install` |

## 📚 Documentation

| File | Purpose |
|------|---------|
| START_HERE.md | Step-by-step setup |
| README.md | Project overview |
| INTEGRATION_GUIDE.md | How frontend/backend connect |
| FINAL_SUMMARY.md | Complete summary |

## 🎯 Features

### ✅ Working Now
- User registration/login
- JWT authentication
- Theme toggle
- Stock browsing
- Search
- Responsive design

### 🔑 Needs API Keys
- Real stock data (Alpha Vantage)
- AI predictions (OpenAI)
- News feed (News API)
- Google OAuth (Google Cloud)

## 📞 Help

1. Check [START_HERE.md](START_HERE.md)
2. Review error in terminal
3. Check browser console
4. Test with curl/Postman

## 🎉 Quick Win

```bash
# 1. Start MongoDB
mongod

# 2. Start backend
cd stock-analyzer-backend && npm run dev

# 3. Start frontend (new terminal)
cd stock-analyzer-frontend && npm run dev

# 4. Open browser
http://localhost:5173

# 5. Register and explore!
```

---

**Need detailed help? → [START_HERE.md](START_HERE.md)**
