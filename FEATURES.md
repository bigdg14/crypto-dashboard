# Cryptocurrency Dashboard - Complete Feature List

## Core Features

### 1. User Authentication
- **NextAuth.js Integration** - Secure authentication system
- **Multiple Providers**:
  - Email/Password (demo mode - any email works)
  - Google OAuth (configure in .env.local)
  - GitHub OAuth (configure in .env.local)
- **Session Management** - JWT-based sessions
- **Protected Routes** - Automatic redirect to sign-in for authenticated features
- **User Menu** - Dropdown with profile and quick access to features

**Files**:
- [lib/auth.ts](lib/auth.ts) - Auth configuration
- [app/api/auth/[...nextauth]/route.ts](app/api/auth/[...nextauth]/route.ts) - Auth API routes
- [app/auth/signin/page.tsx](app/auth/signin/page.tsx) - Sign in page
- [components/user-menu.tsx](components/user-menu.tsx) - User dropdown menu

---

### 2. Portfolio Tracker
Track your cryptocurrency investments with real-time profit/loss calculations.

**Features**:
- Add holdings with purchase price and date
- Real-time portfolio value calculation
- Profit/Loss tracking (dollar amount and percentage)
- Visual statistics cards:
  - Total Portfolio Value
  - Total Invested
  - Total Profit/Loss
  - Return Percentage
- Detailed holdings table with:
  - Current price vs purchase price
  - 24h price change
  - Individual holding profit/loss
  - Total value per holding
- Delete holdings
- Search and add any cryptocurrency
- Image thumbnails for coins

**API Endpoints**:
- `GET /api/portfolio` - Fetch user's portfolio
- `POST /api/portfolio` - Add new holding
- `DELETE /api/portfolio/[id]` - Remove holding

**Files**:
- [app/portfolio/page.tsx](app/portfolio/page.tsx) - Main portfolio page
- [components/portfolio/portfolio-stats.tsx](components/portfolio/portfolio-stats.tsx) - Statistics cards
- [components/portfolio/portfolio-table.tsx](components/portfolio/portfolio-table.tsx) - Holdings table
- [components/portfolio/add-holding-dialog.tsx](components/portfolio/add-holding-dialog.tsx) - Add holding modal

---

### 3. Watchlist
Keep track of your favorite cryptocurrencies.

**Features**:
- Add/remove coins from watchlist
- Real-time price updates
- 24h price change indicators
- Market cap display
- Quick access to coin details
- Add to watchlist button on coin detail pages
- Visual feedback (filled star for watched coins)

**API Endpoints**:
- `GET /api/watchlist` - Fetch user's watchlist
- `POST /api/watchlist` - Add coin to watchlist
- `DELETE /api/watchlist?coinId=xxx` - Remove coin from watchlist

**Files**:
- [app/watchlist/page.tsx](app/watchlist/page.tsx) - Watchlist page
- [components/watchlist/watchlist-table.tsx](components/watchlist/watchlist-table.tsx) - Watchlist table
- [components/watchlist/add-to-watchlist-button.tsx](components/watchlist/add-to-watchlist-button.tsx) - Reusable button component

---

### 4. Price Alerts
Set price targets and get notified when coins reach your specified prices.

**Features**:
- Create custom price alerts
- Two conditions:
  - Price goes **above** target
  - Price goes **below** target
- Alert status tracking (Pending/Triggered)
- Enable/disable alerts with toggle switch
- Real-time price monitoring
- Visual indicators:
  - Green badge for triggered alerts
  - Current price vs target price comparison
  - 24h price change
- Delete alerts
- Search and select any cryptocurrency

**API Endpoints**:
- `GET /api/alerts` - Fetch user's alerts
- `POST /api/alerts` - Create new alert
- `PATCH /api/alerts/[id]` - Toggle alert active status
- `DELETE /api/alerts/[id]` - Delete alert

**Files**:
- [app/alerts/page.tsx](app/alerts/page.tsx) - Alerts page
- [components/alerts/alerts-table.tsx](components/alerts/alerts-table.tsx) - Alerts table with toggle
- [components/alerts/create-alert-dialog.tsx](components/alerts/create-alert-dialog.tsx) - Create alert modal

**Note**: Currently displays alert status. For production, you would implement a background job/webhook to send actual notifications when alerts trigger.

---

### 5. Cryptocurrency Comparison
Compare up to 4 cryptocurrencies side by side.

**Features**:
- Select up to 4 coins for comparison
- Comprehensive metrics:
  - Current Price
  - Market Cap
  - 24h Trading Volume
  - 24h Price Change
  - Market Cap Rank
  - Circulating Supply
  - Total Supply
  - All-Time High
- Visual coin cards with images
- Real-time data
- Add/remove coins dynamically
- Responsive table layout

**Files**:
- [app/compare/page.tsx](app/compare/page.tsx) - Comparison page

---

### 6. Currency Converter
Convert between any two cryptocurrencies at real-time exchange rates.

**Features**:
- Convert between any 2 cryptocurrencies
- Real-time conversion rates
- Search functionality for both currencies
- Swap button to quickly reverse conversion
- Visual currency cards with:
  - Coin images
  - Current USD price
  - Coin name and symbol
- Detailed conversion result:
  - Final amount
  - Conversion summary
  - Exchange rate (1:1 ratio)
- Supports decimal amounts
- Auto-calculation on value change

**Files**:
- [app/converter/page.tsx](app/converter/page.tsx) - Converter tool

---

### 7. Market Overview Dashboard
Real-time cryptocurrency market data (existing feature, enhanced).

**Features**:
- Top 20 cryptocurrencies by market cap
- Global market statistics:
  - Total Market Cap
  - 24h Trading Volume
  - BTC Dominance
  - ETH Dominance
- Price changes (1h, 24h, 7d)
- Sparkline charts (7-day mini charts)
- Market cap rankings
- Responsive table with sorting

**Files**:
- [app/page.tsx](app/page.tsx) - Main dashboard
- [components/crypto/global-stats.tsx](components/crypto/global-stats.tsx) - Global stats cards
- [components/crypto/coins-table.tsx](components/crypto/coins-table.tsx) - Coins table

---

### 8. Coin Detail Pages
Detailed information for individual cryptocurrencies (existing feature, enhanced).

**Features**:
- Comprehensive coin information
- Interactive price charts with multiple timeframes:
  - 1 Day (hourly data)
  - 7 Days (hourly data)
  - 30 Days (6-hour intervals)
  - 1 Year (daily data)
  - MAX (365 days - Demo API limit)
- Statistics cards:
  - Current Price
  - Market Cap
  - 24h Trading Volume
  - Circulating Supply
- 24h price change indicators
- Add to watchlist button
- Coin images and branding
- Rank display

**Files**:
- [app/coin/[id]/page.tsx](app/coin/[id]/page.tsx) - Coin detail page
- [components/crypto/coin-chart.tsx](components/crypto/coin-chart.tsx) - Interactive chart
- [components/crypto/price-change.tsx](components/crypto/price-change.tsx) - Price change component

---

## Technical Features

### API Integration
- **CoinGecko Demo API**:
  - 500 calls/minute
  - 500,000 calls/month
  - 365 days of historical data
  - No cost
- **Automatic API key injection** via Axios interceptors
- **Rate limiting protection** with exponential backoff
- **Smart caching** (30-60 second stale times)
- **Error handling** with retry logic

**Files**:
- [lib/api/coingecko.ts](lib/api/coingecko.ts) - API client
- [lib/hooks/useCrypto.ts](lib/hooks/useCrypto.ts) - React Query hooks

### Database
- **PostgreSQL** via Neon.tech
- **Drizzle ORM** for type-safe queries
- **Schema includes**:
  - Users (NextAuth)
  - Accounts (OAuth)
  - Sessions (JWT)
  - Portfolio holdings
  - Watchlist
  - Price alerts
  - Verification tokens

**Files**:
- [lib/db/schema.ts](lib/db/schema.ts) - Database schema
- [lib/db/index.ts](lib/db/index.ts) - Database connection
- [drizzle.config.ts](drizzle.config.ts) - Drizzle configuration

### UI Components (shadcn/ui)
All components are fully customizable and built with Radix UI primitives:
- **Forms**: Input, Label, Select, Switch
- **Data Display**: Table, Card, Badge, Avatar
- **Overlays**: Dialog, Dropdown Menu, Skeleton
- **Feedback**: Toast (Sonner), Loading states
- **Navigation**: Tabs, Buttons
- **Theme**: Dark/Light mode with system preference

### State Management
- **TanStack Query (React Query)** for server state
- **Next.js App Router** for client state
- **next-auth session** for auth state
- **localStorage** for theme persistence

### Real-time Updates
- **Automatic refetching** every 30-60 seconds
- **Background updates** while app is open
- **Optimistic UI updates** for mutations
- **Cache invalidation** on data changes

---

## Navigation

The app features a responsive navigation bar with:
- Logo and branding
- Navigation links:
  - Dashboard (Home)
  - Trending
  - **Portfolio** (requires auth)
  - **Watchlist** (requires auth)
  - **Compare**
  - **Converter**
  - News (placeholder)
- Dark/Light theme toggle
- User menu with:
  - User profile info
  - Quick links to Portfolio, Watchlist, Alerts
  - Sign out button

**Files**:
- [components/navigation.tsx](components/navigation.tsx) - Main navigation
- [components/theme-toggle.tsx](components/theme-toggle.tsx) - Theme switcher
- [components/user-menu.tsx](components/user-menu.tsx) - User dropdown

---

## Performance Optimizations

1. **Image Optimization**:
   - Next.js Image component for automatic optimization
   - Lazy loading
   - Responsive images

2. **Code Splitting**:
   - Automatic route-based splitting
   - Dynamic imports for heavy components

3. **Caching Strategy**:
   - API responses cached for 30-60 seconds
   - Query deduplication
   - Background refetching

4. **API Rate Limiting**:
   - Exponential backoff on failures
   - Request batching for multiple coins
   - Smart query invalidation

---

## Authentication Flow

1. **Sign In**: User clicks "Sign In" button
2. **Auth Page**: Redirected to `/auth/signin`
3. **Choose Method**:
   - Demo: Enter any email (no password required)
   - OAuth: Click Google/GitHub button
4. **Session Created**: JWT token stored
5. **Redirect**: Back to home or requested page
6. **Protected Routes**: Auto-redirect if not authenticated

---

## Data Flow Examples

### Portfolio Tracker
```
User adds holding →
  Create holding dialog →
    Search for coin →
      CoinGecko search API →
        Select coin →
          Enter amount, price, date →
            POST /api/portfolio →
              Insert to database →
                Invalidate cache →
                  Refetch portfolio →
                    Calculate real-time P/L →
                      Display updated stats
```

### Price Alerts
```
User creates alert →
  Set target price & condition →
    POST /api/alerts →
      Store in database →
        Background job checks prices (future) →
          If triggered →
            Send notification (future) →
              Update alert status
```

### Watchlist
```
User clicks "Add to Watchlist" →
  POST /api/watchlist →
    Check if exists →
      If not, insert →
        Invalidate cache →
          Button changes to "In Watchlist" →
            Star icon fills →
              Coin appears in watchlist page
```

---

## Future Enhancements

Ready to implement but not yet built:

1. **News Feed** - Integrate crypto news API
2. **Trending Page** - Show trending coins
3. **Email Notifications** - Send email when alerts trigger
4. **Push Notifications** - Browser push notifications
5. **Export Data** - Export portfolio to CSV/PDF
6. **Advanced Charts** - Candlestick charts, indicators
7. **Social Features** - Share portfolio, compare with friends
8. **Mobile App** - React Native version
9. **More Exchanges** - Track holdings across multiple exchanges
10. **Tax Reports** - Generate tax documents for trades

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Push database schema
npm run db:push

# Open Drizzle Studio (database GUI)
npm run db:studio

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

## Environment Variables

Required:
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# CoinGecko
NEXT_PUBLIC_COINGECKO_API_KEY="your-api-key"
```

Optional (OAuth):
```env
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
```

---

## Technology Stack

**Frontend**:
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Radix UI primitives

**Backend**:
- Next.js API Routes
- NextAuth.js
- Drizzle ORM
- PostgreSQL (Neon.tech)

**External APIs**:
- CoinGecko Demo API

**Libraries**:
- TanStack Query - Data fetching
- Axios - HTTP client
- date-fns - Date formatting
- Recharts - Charts
- Sonner - Toasts
- Lucide - Icons

---

## Project Structure

```
crypto-dashboard/
├── app/                      # Next.js App Router pages
│   ├── alerts/              # Price alerts page
│   ├── api/                 # API routes
│   │   ├── alerts/         # Alert endpoints
│   │   ├── auth/           # NextAuth endpoints
│   │   ├── portfolio/      # Portfolio endpoints
│   │   └── watchlist/      # Watchlist endpoints
│   ├── auth/               # Authentication pages
│   ├── coin/[id]/          # Coin detail pages
│   ├── compare/            # Comparison tool
│   ├── converter/          # Currency converter
│   ├── portfolio/          # Portfolio tracker
│   ├── watchlist/          # Watchlist
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home dashboard
├── components/             # React components
│   ├── alerts/            # Alert components
│   ├── crypto/            # Crypto-specific components
│   ├── portfolio/         # Portfolio components
│   ├── ui/                # shadcn/ui components
│   ├── watchlist/         # Watchlist components
│   ├── navigation.tsx     # Main navigation
│   ├── providers.tsx      # Context providers
│   └── theme-toggle.tsx   # Theme switcher
├── lib/                   # Utilities and configs
│   ├── api/              # API clients
│   ├── db/               # Database
│   ├── hooks/            # React hooks
│   ├── types/            # TypeScript types
│   └── utils.ts          # Helper functions
├── public/               # Static assets
└── types/                # Global types

Documentation:
├── README.md              # Installation guide
├── FEATURES.md            # This file
├── SETUP_GUIDE.md         # Step-by-step setup
├── API_MIGRATION.md       # API documentation
├── TROUBLESHOOTING.md     # Common issues
├── DEPLOYMENT.md          # Deployment guide
└── MAX_TIMEFRAME_FIX.md   # Technical notes
```

---

**Status**: ✅ All Features Implemented and Working
**Last Updated**: December 30, 2024
