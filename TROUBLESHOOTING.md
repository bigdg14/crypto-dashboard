# 🔧 Troubleshooting Guide

## ✅ API Migration Notice

**We've migrated from CoinGecko to CoinGecko Demo API!**

The previous rate limiting issues with CoinGecko (45-60 second waits between requests) are now **completely resolved**. CoinGecko Demo API has no official rate limits and is completely free. See [API_MIGRATION.md](API_MIGRATION.md) for details.

## Chart Issues

### Charts Not Loading for Certain Timeframes

**Problem:** When clicking on 1D or MAX timeframes, the chart doesn't load or shows an error.

**Causes & Solutions:**

1. **CoinCap API Issues** ⚠️ Rare with CoinCap
   - Demo tier has 500 calls/minute official rate limits
   - **Solution:** If you encounter issues, wait 10-15 seconds and try again
   - Much more generous than the previous CoinGecko API

2. **MAX Timeframe**
   - **Current implementation:** MAX shows 1 year (365 days) of data
   - CoinGecko Demo API tier limits historical data to 365 days
   - Paid plans get unlimited historical data
   - Works reliably without rate limiting!

3. **API Parameter Issues**
   - Auto-determined based on timeframe selected

4. **Data Not Available**
   - Some very new coins may not have sufficient historical data
   - Try shorter timeframes (7D or 30D) first
   - Check CoinGecko.com to verify data availability

**How to Debug:**
```bash
# Open browser console (F12) and check for errors
# Look for API response errors like:
# - 404 (Coin/Asset not found)
# - 500 (Server error)
# - Network errors
```

---

## Image Loading Issues

### Cryptocurrency Images Not Displaying

**Problem:** Coin images show broken image icons.

**Solution:**
- **Fixed in latest version:** Added CoinGecko image domain to Next.js config
- If still having issues, restart the dev server:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

**Verify Fix:**
Check [next.config.ts](file:///c:/WorkingFolder/Projects/DataVisualizationDashboard/crypto-dashboard/next.config.ts) includes:
```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'coin-images.coingecko.com',
      pathname: '/coins/images/**',
    },
  ],
}
```

---

## Database Issues

### Connection Error

**Problem:** `Error: getaddrinfo ENOTFOUND` or database connection fails.

**Solutions:**

1. **Check DATABASE_URL**
   ```bash
   # Verify .env.local has correct connection string
   cat .env.local | grep DATABASE_URL
   ```

2. **Verify Neon.tech Database**
   - Login to [console.neon.tech](https://console.neon.tech)
   - Check if database is active
   - Get fresh connection string if needed

3. **Push Schema Again**
   ```bash
   npm run db:push
   ```

### Tables Not Created

**Problem:** Database tables don't exist.

**Solution:**
```bash
# Push the schema to create all tables
npm run db:push

# Verify tables with Drizzle Studio
npm run db:studio
```

---

## Build Errors

### TypeScript Errors

**Problem:** Build fails with TypeScript errors.

**Common Fixes:**

1. **Module Not Found**
   ```bash
   # Delete and reinstall dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Type Errors in Components**
   ```bash
   # Check for outdated types
   npm install @types/node@latest @types/react@latest @types/react-dom@latest
   ```

3. **Import Alias Issues**
   - Verify `tsconfig.json` has `"@/*"` alias
   - Restart your IDE/editor

### Tailwind CSS Not Working

**Problem:** Styles not applying or Tailwind classes not working.

**Solutions:**

1. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

2. **Verify Tailwind v4 Setup**
   - Check `postcss.config.mjs` has `@tailwindcss/postcss`
   - Verify `app/globals.css` imports Tailwind

---

## API Issues

### API Connection Issues

**Problem:** Data not loading from CoinCap API.

**Solutions:**

1. **Check Network Connection**
   - Verify internet connection is working
   - CoinCap API: `https://api.coincap.io/v2`
   - Test in browser: `https://api.coincap.io/v2/assets/bitcoin`

2. **Clear Cache**
   - The app caches data for 30 seconds
   - Hard refresh browser (Ctrl+Shift+R)
   - Clear browser cache if needed

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for network errors or API failures

### Data Not Updating

**Problem:** Prices seem stale or not updating.

**Solutions:**

1. **Check React Query Cache**
   - Data refreshes every 30 seconds by default
   - Hard refresh browser (Ctrl+Shift+R)

2. **Verify API Connection**
   ```bash
   # Check if CoinCap API is accessible
   curl https://api.coincap.io/v2/assets/bitcoin
   ```

---

## Theme Issues

### Theme Not Persisting

**Problem:** Theme resets to default after refresh.

**Solutions:**

1. **Check localStorage**
   - Open browser console
   - Run: `localStorage.getItem('crypto-dashboard-theme')`
   - Should return "dark" or "light"

2. **Clear Cache and Storage**
   - Clear browser cache
   - Clear localStorage
   - Set theme again

### Dark Mode Not Working

**Problem:** Page stays in light mode or vice versa.

**Solutions:**

1. **Verify Theme Provider**
   - Check [app/layout.tsx](file:///c:/WorkingFolder/Projects/DataVisualizationDashboard/crypto-dashboard/app/layout.tsx) wraps children with `<Providers>`
   - Ensure `suppressHydrationWarning` on `<html>` tag

2. **Check CSS Variables**
   - Verify [app/globals.css](file:///c:/WorkingFolder/Projects/DataVisualizationDashboard/crypto-dashboard/app/globals.css) has `.dark` class styles

---

## Performance Issues

### Slow Page Load

**Problem:** Dashboard takes long to load.

**Solutions:**

1. **Check Network**
   - Open DevTools → Network tab
   - Look for slow API requests
   - CoinGecko free tier can be slow during peak hours

2. **Optimize Images**
   - Already using Next.js Image optimization
   - Images should load progressively

3. **Enable Production Mode**
   ```bash
   npm run build
   npm run start
   ```
   - Production is faster than dev mode

### Memory Leaks

**Problem:** Browser tab uses too much memory.

**Solutions:**

1. **Disable Auto-refresh Temporarily**
   - Edit React Query config in [components/providers.tsx](file:///c:/WorkingFolder/Projects/DataVisualizationDashboard/crypto-dashboard/components/providers.tsx)
   - Set `refetchInterval: false` for testing

2. **Clear Browser Cache**
   - Too many cached API responses
   - Clear browser data

---

## Development Issues

### Hot Reload Not Working

**Problem:** Changes don't reflect in browser.

**Solutions:**

1. **Restart Dev Server**
   ```bash
   # Ctrl+C to stop
   npm run dev
   ```

2. **Clear Next.js Cache**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check File Watchers** (Linux/Mac)
   ```bash
   # Increase file watcher limit
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

---

## Deployment Issues

### Vercel Build Fails

**Problem:** Build succeeds locally but fails on Vercel.

**Solutions:**

1. **Check Environment Variables**
   - Verify all required env vars are set in Vercel dashboard
   - Don't forget `NEXTAUTH_SECRET`

2. **Node Version Mismatch**
   - Vercel uses Node 18 by default
   - Add to `package.json`:
   ```json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

3. **Build Command**
   - Ensure Vercel uses: `npm run build`
   - Output directory: `.next`

### Database Connection Fails in Production

**Problem:** App works locally but can't connect to database on Vercel.

**Solutions:**

1. **Check Connection String**
   - Use production connection string from Neon.tech
   - Must include `?sslmode=require`

2. **Neon Connection Pooling**
   - Use pooled connection string for serverless
   - Available in Neon.tech dashboard

---

## Common Error Messages

### `ECONNREFUSED` or `Network Error`

**Cause:** Can't reach API or database

**Fix:**
- Check internet connection
- Verify API endpoints are accessible
- Check firewall/proxy settings

### `Module not found: Can't resolve '@/...'`

**Cause:** Import alias not configured

**Fix:**
- Check `tsconfig.json` has paths configured
- Restart TypeScript server in IDE
- Run `npm install`

### `Hydration failed` or `Text content does not match`

**Cause:** Server/client mismatch (common with theme)

**Fix:**
- Add `suppressHydrationWarning` to `<html>` tag
- Ensure theme is applied correctly
- Check for dynamic content rendered differently on server

---

## Getting Help

If you're still experiencing issues:

1. **Check Browser Console**
   - Press F12 to open DevTools
   - Look for errors in Console tab
   - Check Network tab for failed requests

2. **Check Server Logs**
   ```bash
   # Development logs show in terminal
   npm run dev
   ```

3. **Review Documentation**
   - [README.md](file:///c:/WorkingFolder/Projects/DataVisualizationDashboard/crypto-dashboard/README.md) - Installation guide
   - [SETUP_GUIDE.md](file:///c:/WorkingFolder/Projects/DataVisualizationDashboard/crypto-dashboard/SETUP_GUIDE.md) - Step-by-step setup
   - [DEPLOYMENT.md](file:///c:/WorkingFolder/Projects/DataVisualizationDashboard/crypto-dashboard/DEPLOYMENT.md) - Deployment help

4. **Common Debugging Steps**
   ```bash
   # Nuclear option - fresh start
   rm -rf node_modules .next package-lock.json
   npm install
   npm run dev
   ```

---

**Last Updated:** December 2024
