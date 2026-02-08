# 📁 Project Structure

```
stock-analyzer-frontend/
├── public/                          # Static assets
│   └── vite.svg                     # Vite logo
│
├── src/                             # Source code
│   ├── api/                         # API integration
│   │   ├── axios.js                 # Axios instance with interceptors
│   │   └── stockApi.js              # API endpoint functions
│   │
│   ├── components/                  # Reusable components
│   │   ├── Navbar.jsx               # Navigation with auth dropdown
│   │   ├── SearchBar.jsx            # Animated search with autocomplete
│   │   ├── StockCard.jsx            # Stock display card
│   │   ├── StockChart.jsx           # Interactive charts (Recharts)
│   │   └── MarketWidget.jsx         # Market movers widget
│   │
│   ├── pages/                       # Page components
│   │   ├── LandingPage.jsx          # Hero + market overview
│   │   ├── StocksPage.jsx           # Stock listing with filters
│   │   ├── StockDetailPage.jsx      # Individual stock analysis
│   │   ├── BlogsPage.jsx            # Blogs & news
│   │   ├── PremiumPage.jsx          # Subscription plans
│   │   └── LoginPage.jsx            # Authentication
│   │
│   ├── store/                       # State management (Zustand)
│   │   ├── authStore.js             # Auth state (user, token, login/logout)
│   │   └── themeStore.js            # Theme state (light/dark toggle)
│   │
│   ├── App.jsx                      # Main app with routing
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles + Tailwind
│
├── .env                             # Environment variables
├── .env.example                     # Environment template
├── .gitignore                       # Git ignore rules
├── eslint.config.js                 # ESLint configuration
├── index.html                       # HTML entry point
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── vite.config.js                   # Vite configuration
│
├── README.md                        # Full documentation
├── PROJECT_OVERVIEW.md              # Architecture & design system
├── API_INTEGRATION.md               # Backend API specs
├── QUICKSTART.md                    # Quick start guide
└── STRUCTURE.md                     # This file
```

## 📂 Directory Details

### `/src/api/`
**Purpose**: Centralized API integration layer

**Files**:
- `axios.js` - Configured Axios instance with:
  - Base URL from environment
  - Request interceptor (adds auth token)
  - Response interceptor (handles 401 errors)
  
- `stockApi.js` - API endpoint functions:
  - `stockApi.*` - Stock-related endpoints
  - `blogApi.*` - Blog-related endpoints
  - `authApi.*` - Authentication endpoints
  - `subscriptionApi.*` - Subscription endpoints

**Usage**:
```javascript
import { stockApi } from '../api/stockApi';
const response = await stockApi.getStocks();
```

---

### `/src/components/`
**Purpose**: Reusable UI components

#### `Navbar.jsx`
- Responsive navigation bar
- Auth-aware (shows login/signup or profile dropdown)
- Theme toggle button
- Mobile hamburger menu
- Animated with Framer Motion

#### `SearchBar.jsx`
- Autocomplete search functionality
- Debounced API calls (300ms)
- Animated dropdown results
- Large variant for hero section
- Click-outside to close

#### `StockCard.jsx`
- Displays stock information
- Trend indicators (up/down arrows)
- Hover animations
- Click to navigate to detail page
- Stagger animation support

#### `StockChart.jsx`
- Interactive stock price charts
- Multiple timeframes (1D, 1W, 1M, 3M, 1Y, ALL)
- Chart types (Area, Line)
- Theme-aware colors
- Recharts library

#### `MarketWidget.jsx`
- Displays market movers
- Color-coded by category
- Click to navigate to stock
- Animated list items
- Empty state handling

---

### `/src/pages/`
**Purpose**: Full page components

#### `LandingPage.jsx`
- GSAP animated hero section
- Large search bar
- 5 market widgets (Gainers, Losers, Most Traded, Least Traded, In News)
- Floating background elements
- CTA section

#### `StocksPage.jsx`
- Stock listing with grid layout
- Filter buttons (All, Gainers, Losers, Volume, News)
- Search functionality
- Loading states
- Empty state

#### `StockDetailPage.jsx`
- Stock header with price & stats
- Interactive chart
- AI predictions with confidence levels
- Company information
- Latest news feed
- Peer comparison table

#### `BlogsPage.jsx`
- Blog grid layout
- Tag-based filtering
- Image previews
- Reading time estimates
- Animated cards

#### `PremiumPage.jsx`
- 3 subscription tiers (Basic, Pro, Elite)
- Feature comparison
- Animated pricing cards
- CTA sections
- "Most Popular" badge

#### `LoginPage.jsx`
- Email/password form
- OAuth buttons (Google, GitHub)
- Remember me checkbox
- Forgot password link
- Sign up link
- Auto-login for demo

---

### `/src/store/`
**Purpose**: Global state management with Zustand

#### `authStore.js`
**State**:
```javascript
{
  user: null,           // User object
  token: null,          // JWT token
  isAuthenticated: false
}
```

**Actions**:
- `login(userData, token)` - Set user and token
- `logout()` - Clear user and token
- `updateUser(userData)` - Update user info

**Persistence**: localStorage (`auth-storage`)

#### `themeStore.js`
**State**:
```javascript
{
  theme: 'light'  // 'light' or 'dark'
}
```

**Actions**:
- `toggleTheme()` - Switch between light/dark
- `setTheme(theme)` - Set specific theme

**Persistence**: localStorage (`theme-storage`)

---

### Root Files

#### `App.jsx`
- Main application component
- React Router setup
- React Query provider
- Theme initialization
- Route definitions

#### `main.jsx`
- Application entry point
- React DOM rendering
- StrictMode wrapper

#### `index.css`
- Tailwind directives
- Custom base styles
- Component classes (`.card`, `.btn-primary`, `.btn-secondary`)
- Global transitions

#### `tailwind.config.js`
- Custom color tokens
- Animation definitions
- Dark mode configuration
- Content paths

#### `vite.config.js`
- Vite configuration
- React plugin
- Build settings

#### `postcss.config.js`
- Tailwind CSS plugin
- Autoprefixer plugin

#### `.env`
- Environment variables
- API URL configuration

---

## 🎨 Component Patterns

### Standard Component Structure
```javascript
// 1. Imports
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// 2. Component
const MyComponent = ({ prop1, prop2 }) => {
  // 3. State
  const [state, setState] = useState();
  
  // 4. Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // 5. Handlers
  const handleClick = () => {
    // Event handling
  };
  
  // 6. Render
  return (
    <motion.div>
      {/* JSX */}
    </motion.div>
  );
};

// 7. Export
export default MyComponent;
```

### Page Component Pattern
```javascript
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Component from '../components/Component';
import { api } from '../api/stockApi';

const PageName = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getData();
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
      // Fallback to mock data
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page content */}
      </div>
    </div>
  );
};

export default PageName;
```

---

## 🔄 Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Call (axios.js)
    ↓
Backend API
    ↓
Response
    ↓
React Query Cache (optional)
    ↓
Component State Update
    ↓
UI Re-render
```

### With Zustand Store
```
User Action
    ↓
Store Action (login, logout, toggleTheme)
    ↓
Store State Update
    ↓
localStorage Sync
    ↓
All Subscribed Components Re-render
```

---

## 🎯 File Naming Conventions

- **Components**: PascalCase (e.g., `StockCard.jsx`)
- **Pages**: PascalCase (e.g., `LandingPage.jsx`)
- **Stores**: camelCase (e.g., `authStore.js`)
- **API files**: camelCase (e.g., `stockApi.js`)
- **Config files**: kebab-case (e.g., `tailwind.config.js`)

---

## 📦 Import Patterns

### Relative Imports
```javascript
// From component to component
import Navbar from '../components/Navbar';

// From page to component
import StockCard from '../components/StockCard';

// From component to store
import { useAuthStore } from '../store/authStore';

// From component to API
import { stockApi } from '../api/stockApi';
```

### Absolute Imports (if configured)
```javascript
import Navbar from '@/components/Navbar';
import { useAuthStore } from '@/store/authStore';
```

---

## 🚀 Adding New Features

### New Component
1. Create file in `src/components/ComponentName.jsx`
2. Import and use in pages
3. Add to this documentation

### New Page
1. Create file in `src/pages/PageName.jsx`
2. Add route in `src/App.jsx`
3. Add navigation link in `src/components/Navbar.jsx`
4. Update this documentation

### New API Endpoint
1. Add function in `src/api/stockApi.js`
2. Use in components/pages
3. Document in `API_INTEGRATION.md`

### New Store
1. Create file in `src/store/storeName.js`
2. Use Zustand pattern with persist
3. Import and use in components
4. Update this documentation

---

## 📊 Size Guidelines

- **Components**: < 300 lines (split if larger)
- **Pages**: < 500 lines (extract components if larger)
- **Stores**: < 100 lines (one responsibility)
- **API files**: Group related endpoints

---

**This structure keeps the codebase organized, maintainable, and scalable.**
