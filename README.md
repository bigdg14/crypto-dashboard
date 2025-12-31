# 🚀 CryptoTrack - Professional Cryptocurrency Dashboard

A feature-rich, real-time cryptocurrency tracking dashboard built with Next.js 14+, TypeScript, Tailwind CSS, and shadcn/ui. Track prices, manage your portfolio, and stay updated with the latest crypto market trends.

## ✨ Features

### 📊 Market Overview
- **Real-time price updates** - Auto-refreshes every 60 seconds
- **Top 20 cryptocurrencies** by market cap
- **Global market statistics** - Total market cap, 24h volume, BTC/ETH dominance
- **Price change indicators** - 1h, 24h, 7d percentage changes
- **Mini sparkline charts** - Quick visual price trends
- **Sortable & filterable** coin listings

### 💹 Detailed Coin View
- **Interactive price charts** with multiple timeframes (1D, 7D, 30D, 1Y, All-time)
- **Volume charts** below price charts
- **Comprehensive statistics** - ATH/ATL, 24h high/low, market cap rank
- **Supply information** - Circulating, total, and max supply
- **Price change percentages** across multiple timeframes

### 🎨 Modern UI/UX
- **Dark mode by default** with light mode toggle
- **Persistent theme preference** saved to localStorage
- **Glass morphism effects** on cards and panels
- **Smooth animations** and transitions
- **Fully responsive** - Mobile, tablet, and desktop optimized
- **Professional color scheme** - Blues for positive, reds for negative changes

### 🔥 Coming Soon (Already Structured)
- Portfolio tracker with profit/loss calculations
- Personal watchlist with database persistence
- Comparison mode for multiple coins
- Currency converter
- Crypto news feed
- Price alerts
- User authentication (NextAuth.js)

## 🛠️ Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui (Radix UI)
- **Database:** Neon.tech (PostgreSQL)
- **ORM:** Drizzle ORM
- **Authentication:** NextAuth.js (configured, ready to use)
- **Data Fetching:** TanStack Query (React Query)
- **Charts:** Recharts
- **API:** CoinGecko Demo API (500 calls/min, 365 days history) 🎉
- **State Management:** Zustand
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- A Neon.tech account (free tier available)
- Optional: CoinGecko Pro API key (free tier works without key)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd crypto-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database - Get this from Neon.tech
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# CoinGecko API - Get your free Demo API key from https://www.coingecko.com/en/api/pricing
# Demo tier: 500 calls/min (much better than free tier's 10-50 calls/min)
NEXT_PUBLIC_COINGECKO_API_KEY="your-demo-api-key-here"

# News API (Optional)
NEWS_API_KEY=""
```

### 4. Set up Neon.tech Database

1. Go to [Neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string
4. Paste it into your `.env.local` as `DATABASE_URL`

### 5. Push database schema

```bash
npm run db:push
```

This will create all the necessary tables in your Neon database.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard in action!

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your environment variables:
   - `DATABASE_URL` (from Neon.tech)
   - `NEXTAUTH_URL` (your production URL)
   - `NEXTAUTH_SECRET` (generate a secure secret)
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `DATABASE_URL` - Your Neon.tech production database URL
- `NEXTAUTH_URL` - Your production domain (e.g., https://cryptotrack.vercel.app)
- `NEXTAUTH_SECRET` - Generate with `openssl rand -base64 32`

## 📁 Project Structure

```
crypto-dashboard/
├── app/
│   ├── coin/[id]/       # Individual coin detail pages
│   ├── portfolio/       # Portfolio tracker (to be implemented)
│   ├── watchlist/       # User watchlist (to be implemented)
│   ├── compare/         # Comparison mode (to be implemented)
│   ├── layout.tsx       # Root layout with providers
│   ├── page.tsx         # Home page - Market overview
│   └── globals.css      # Global styles and theme variables
├── components/
│   ├── crypto/          # Crypto-specific components
│   ├── ui/              # shadcn/ui components
│   ├── navigation.tsx   # Main navigation bar
│   ├── providers.tsx    # React Query & Theme providers
│   └── theme-toggle.tsx
├── lib/
│   ├── api/coingecko.ts # CoinGecko API client
│   ├── db/              # Database schema and connection
│   ├── hooks/           # Custom React Query hooks
│   └── types/           # TypeScript definitions
└── drizzle/             # Database migrations
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🌟 API Rate Limits

### CoinGecko Free Tier
- 10-50 calls/minute (depending on endpoint)
- No API key required for basic usage
- The app includes retry logic with exponential backoff

## 📄 License

MIT License - feel free to use this project for your portfolio or commercial projects.

---

**Made with ❤️ using Next.js and TypeScript**
