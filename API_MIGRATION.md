# CoinGecko Demo API Setup

## Current Setup

**Using CoinGecko Demo API:**
- ✅ **500 calls/minute** (vs 10-50 on free tier)
- ✅ **500,000 calls/month**
- ✅ **365 days of historical data**
- ✅ **30-second cache** for optimal performance
- ✅ **All timeframes work** (1D, 7D, 30D, 1Y, MAX)

## Why CoinGecko Demo API?

### Benefits
- **10-50x faster rate limits** compared to free tier
- **Reliable and stable** - CoinGecko is industry standard
- **No DNS issues** - always accessible
- **Great documentation** and support
- **Perfect for development** and personal use

### What You Get
- Real-time cryptocurrency prices
- Historical market data (up to 365 days)
- Global market statistics
- Trending coins
- Search functionality
- Market cap rankings

## Implementation

### API Key Configuration
- **Location:** `.env.local`
- **Variable:** `NEXT_PUBLIC_COINGECKO_API_KEY`
- **Method:** Query parameter (`x_cg_demo_api_key`)

### Code Structure
- **API Client:** `lib/api/coingecko.ts`
- **Hooks:** `lib/hooks/useCrypto.ts`
- **Auto-retry:** Built-in exponential backoff
- **Caching:** 30-60 second cache times

## Rate Limit Comparison

| Tier | Calls/Min | Calls/Month | History | Cost |
|------|-----------|-------------|---------|------|
| **Demo (Current)** | **500** | **500,000** | **365 days** | **Free** |
| Analyst | 500 | 500,000 | Unlimited | $129/mo |
| Pro | 500 | 2,000,000 | Unlimited | $499/mo |

## Timeframe Details

| Button | Days | What You Get |
|--------|------|--------------|
| 1D | 1 | Hourly data points (~24) |
| 7D | 7 | Hourly data points (~168) |
| 30D | 30 | 6-hour intervals (~120) |
| 1Y | 365 | Daily data points (~365) |
| MAX | 365 | Same as 1Y (Demo limit) |

## Testing

Test your API key:
```bash
# Get Bitcoin price
curl "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=bitcoin&x_cg_demo_api_key=YOUR_KEY"

# Get market data
curl "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&x_cg_demo_api_key=YOUR_KEY"

# Get chart data
curl "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&x_cg_demo_api_key=YOUR_KEY"
```

## What Was Removed

### CoinCap API
- **Why removed:** `api.coincap.io` subdomain not resolving (DNS issue)
- **Status:** Not accessible
- **Decision:** Simplified to CoinGecko-only implementation

### Hybrid API
- **Why removed:** Unnecessary complexity with CoinCap unavailable
- **Replaced with:** Direct CoinGecko API calls
- **Benefits:** Simpler code, easier to maintain

## Migration Summary

### Before
- Complex hybrid system trying CoinCap first
- Fallback logic to CoinGecko
- Multiple API client files
- DNS resolution issues

### After
- **Single API:** CoinGecko Demo only
- **Simpler code:** Direct API calls
- **More reliable:** No DNS issues
- **Better performance:** 500 calls/min

## Upgrade Path

If you need more than 365 days of historical data or higher limits:

**Analyst Plan ($129/mo):**
- Unlimited historical data
- Same 500 calls/min
- Priority support

**Pro Plan ($499/mo):**
- Unlimited historical data
- 2M calls/month (vs 500K)
- Advanced features

**For most users, Demo tier is perfect!**

---

**Status:** ✅ Production Ready
**API:** CoinGecko Demo API
**Last Updated:** December 30, 2024
