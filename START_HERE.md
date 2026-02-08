# 🚀 Quick Start Guide

## Step-by-Step Instructions

### 1. Start Backend Server

Open a **new terminal/command prompt** and run:

```bash
cd stock-analyzer-backend
npm install
npm run dev
```

**Wait for this message:**
```
✅ MongoDB Connected: ...
🚀 Stock Analyzer Backend Server
   Port: 5000
```

### 2. Start Frontend Server

Open **another terminal/command prompt** and run:

```bash
cd stock-analyzer-frontend
npm install
npm run dev
```

**Wait for this message:**
```
VITE v7.3.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

### 3. Open Your Browser

Go to: **http://localhost:5173**

---

## ⚠️ Prerequisites

Before starting, make sure you have:

1. **Node.js 18+** installed
   - Check: `node --version`
   - Download: https://nodejs.org

2. **MongoDB** running
   - Check: `mongosh` (should connect)
   - Start: `mongod` or use MongoDB Compass
   - Or use MongoDB Atlas (cloud)

3. **Environment files** configured
   - Backend: `stock-analyzer-backend/.env`
   - Frontend: `stock-analyzer-frontend/.env`

---

## 🔧 First Time Setup

### Backend Environment

Create `stock-analyzer-backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stock-analyzer
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-min-32-chars
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment

Create `stock-analyzer-frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## ✅ Verify Everything Works

### 1. Test Backend
Open: http://localhost:5000/health

Should see:
```json
{
  "success": true,
  "message": "Server is running"
}
```

### 2. Test Frontend
Open: http://localhost:5173

Should see the landing page with:
- Animated hero section
- Search bar
- Market widgets

### 3. Test Registration
1. Click "Sign Up"
2. Fill in the form
3. Click "Sign Up"
4. Should redirect to home page
5. Profile icon should appear in navbar

---

## 🐛 Troubleshooting

### Backend won't start

**Error: MongoDB connection failed**
```bash
# Start MongoDB
mongod

# Or check if it's running
mongosh
```

**Error: Port 5000 already in use**
```bash
# Change PORT in backend/.env
PORT=5001
```

**Error: Cannot find module**
```bash
cd stock-analyzer-backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend won't start

**Error: Port 5173 already in use**
```bash
# Kill the process or it will ask to use another port
# Press 'y' to use alternative port
```

**Error: Cannot find module**
```bash
cd stock-analyzer-frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Error in Browser

**Error: Access blocked by CORS policy**

Check `stock-analyzer-backend/.env`:
```env
FRONTEND_URL=http://localhost:5173
```

Restart backend server.

### 401 Unauthorized

**Error: Not authorized**

1. Make sure you're logged in
2. Try logging out and back in
3. Check browser console for errors
4. Clear localStorage and try again

---

## 📚 Next Steps

Once everything is running:

1. **Explore the app**
   - Browse stocks
   - Search for stocks
   - View stock details
   - Toggle dark/light theme

2. **Test features**
   - Register a new account
   - Login
   - Add stocks to watchlist
   - View predictions (requires subscription)

3. **Configure external APIs** (optional)
   - Get API keys for real data
   - Update backend `.env`
   - Restart backend

4. **Read documentation**
   - `INTEGRATION_GUIDE.md` - How it all works
   - `FINAL_SUMMARY.md` - Complete overview
   - Individual README files in each folder

---

## 🎉 You're All Set!

Your stock market analyzer is now running!

**Frontend**: http://localhost:5173
**Backend**: http://localhost:5000

**Need help?** Check the documentation files or review the error messages in the terminal.

---

**Happy coding! 🚀**
