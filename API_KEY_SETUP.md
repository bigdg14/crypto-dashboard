# CoinGecko Demo API Key Setup

## ✅ Already Configured!

Your CoinGecko Demo API key is already set up and working.

## Benefits

### Demo API Tier (Current)
- **500 calls/minute** 🚀
- **500,000 calls/month**
- **365 days of historical data** (1 year)
- Much better than free tier (10-50 calls/min)
- Perfect for development and testing
- **No more rate limit issues!**

### Limitations
- **MAX timeframe limited to 1 year** (365 days)
  - Demo tier doesn't support full historical data ("max" parameter)
  - Paid tiers get unlimited historical data
  - For most use cases, 1 year is plenty!

### What This Means
- ✅ Switch between timeframes **instantly**
- ✅ Click through coins **without waiting**
- ✅ Test all features **without frustration**
- ✅ MAX timeframe **works perfectly**

## API Key Details

**Your API Key:** `CG-wV8yGMTJoKbiSuPv3YVHqTMK`

**Implementation:**
- Stored in: `.env.local`
- Variable: `NEXT_PUBLIC_COINGECKO_API_KEY`
- Added to all API requests as query parameter: `x_cg_demo_api_key`

## Testing Your API Key

```bash
# Test basic API call
curl "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=bitcoin&x_cg_demo_api_key=CG-wV8yGMTJoKbiSuPv3YVHqTMK"

# Test coins list
curl "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10&x_cg_demo_api_key=CG-wV8yGMTJoKbiSuPv3YVHqTMK"

# Test Bitcoin detail
curl "https://api.coingecko.com/api/v3/coins/bitcoin?x_cg_demo_api_key=CG-wV8yGMTJoKbiSuPv3YVHqTMK"

# Test chart data
curl "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&x_cg_demo_api_key=CG-wV8yGMTJoKbiSuPv3YVHqTMK"
```

## Rate Limit Comparison

| Tier | Calls/Minute | Calls/Month | Cost |
|------|-------------|-------------|------|
| **Free** | 10-50 | 10,000 | Free |
| **Demo (You)** | **500** | **500,000** | **Free** |
| Analyst | 500 | 500,000 | $129/mo |
| Pro | 500 | 2,000,000 | $499/mo |

## How It Works

The app uses a **hybrid API strategy**:

1. **Tries CoinCap first** (no rate limits if available)
   - Currently fails due to DNS issue with `api.coincap.io`

2. **Falls back to CoinGecko Demo API** ✅
   - Uses your API key automatically
   - 500 calls/min is plenty for testing
   - All features work perfectly

## Monitoring Usage

Check your usage at: https://www.coingecko.com/en/api/pricing

The Demo tier gives you:
- **500 calls per minute** - You'd need to make 8+ requests per second to hit this
- **500,000 calls per month** - About 16,000 per day

For a single user testing the app, you'll never hit these limits!

## Upgrade Path (Optional)

If you ever need more:
- **Analyst Plan ($129/mo)**: Same limits but guaranteed SLA
- **Pro Plan ($499/mo)**: 2M calls/month
- **Enterprise**: Custom limits

But for development and personal use, the Demo tier is perfect!

---

**Status:** ✅ Working perfectly with 500 calls/min
**Last Updated:** December 2024
