# MAX Timeframe Fix

## ✅ Issue Resolved

**Problem:** MAX timeframe was not working
**Root Cause:** CoinGecko Demo API has a 365-day limit for historical data
**Solution:** MAX now uses 365 days instead of "max" string

## What Changed

### Code Update
[lib/api/coingecko.ts:75](lib/api/coingecko.ts#L75)
```typescript
// OLD - Tried to pass "max" as string
days: days

// NEW - Convert "max" to 365 days
const daysParam = days === "max" ? 365 : days
days: daysParam
```

### API Endpoint
When you click MAX, the app now calls:
```
https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&x_cg_demo_api_key=CG-wV8yGMTJoKbiSuPv3YVHqTMK
```

## API Tier Limitations

### Demo API (Your Current Tier)
- ✅ **500 calls/minute**
- ✅ **500,000 calls/month**
- ⚠️ **365 days max historical data**

### Error When Using "max" String
```json
{
  "error": {
    "status": {
      "error_code": 10012,
      "error_message": "Your request exceeds the allowed time range. Public API users are limited to querying historical data within the past 365 days."
    }
  }
}
```

## Test Results

### Before Fix (FAILED)
```bash
curl "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=max&x_cg_demo_api_key=..."
# Error: exceeds allowed time range
```

### After Fix (SUCCESS ✅)
```bash
curl "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365&x_cg_demo_api_key=..."
# Returns 366 data points (1 year of daily data)
```

## Timeframe Summary

| Button | Days | Data Points | Works? |
|--------|------|-------------|--------|
| 1D | 1 | ~24 (hourly) | ✅ |
| 7D | 7 | ~168 (hourly) | ✅ |
| 30D | 30 | ~120 (6-hour) | ✅ |
| 1Y | 365 | ~365 (daily) | ✅ |
| **MAX** | **365** | **~366 (daily)** | **✅** |

## What You Get with MAX

- **1 year of historical price data**
- **Daily data points** (auto-determined by CoinGecko)
- **Includes:**
  - Price history
  - Market cap history
  - 24h volume history

## Upgrade Path (If You Need More History)

If you need more than 1 year of data:

| Plan | Historical Data | Cost |
|------|----------------|------|
| Demo (Current) | 365 days | Free |
| Analyst | Unlimited | $129/mo |
| Pro | Unlimited | $499/mo |
| Enterprise | Unlimited | Custom |

**For most use cases, 1 year is plenty!**

## Testing

Restart your dev server to load the updated code:
```bash
cd crypto-dashboard
npm run dev
```

Then:
1. Click on any coin (e.g., Bitcoin)
2. Click the **MAX** button
3. Chart should load showing 1 year of data ✅
4. No more errors! 🎉

---

**Status:** ✅ Fixed
**Last Updated:** December 30, 2024
