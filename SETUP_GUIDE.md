# 🚀 Quick Setup Guide - CryptoTrack Dashboard

## Step-by-Step Setup for Development

### 1. Install Dependencies ✅

Already done! If you need to reinstall:
```bash
npm install
```

### 2. Set Up Neon.tech Database (5 minutes)

#### A. Create a Neon Account
1. Visit [https://neon.tech](https://neon.tech)
2. Click "Sign Up" (GitHub auth recommended)
3. Verify your email

#### B. Create a New Project
1. Click "Create Project"
2. Name it "crypto-dashboard"
3. Select your preferred region
4. Click "Create Project"

#### C. Get Your Connection String
1. Once created, you'll see the connection details
2. Copy the **Connection String** (starts with `postgresql://`)
3. It looks like: `postgresql://username:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

#### D. Add to Environment Variables
1. Open `.env.local` in the project root
2. Replace the `DATABASE_URL` with your connection string:
```env
DATABASE_URL="postgresql://your-connection-string-here"
```

### 3. Push Database Schema

Run this command to create all tables in your Neon database:
```bash
npm run db:push
```

You should see output like:
```
✔ Pushing schema changes to database...
✔ Successfully pushed schema
```

### 4. Generate NextAuth Secret

For authentication to work, generate a secure secret:

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the output and add it to `.env.local`:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

---

## 🎉 You're All Set!

You should now see:
- **Global Market Stats** at the top
- **Top 20 Cryptocurrencies** in a table
- **Real-time price updates** every 60 seconds
- **Dark mode** by default (toggle in top-right)

---

## 🔍 Troubleshooting

### Database Connection Error

**Error:** `Error: getaddrinfo ENOTFOUND`

**Solution:**
1. Check your `DATABASE_URL` in `.env.local`
2. Make sure there are no extra spaces
3. Verify the connection string is correct on Neon.tech dashboard

### API Rate Limiting

**Error:** `429 Too Many Requests`

**Solution:**
- CoinGecko free tier has rate limits
- The app auto-retries with backoff
- Wait a few seconds and refresh
- Consider getting a CoinGecko Pro API key for higher limits

### Module Not Found Errors

**Error:** `Cannot find module '@/...'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

**Error:** TypeScript or build errors

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

---

## 🎨 Next Steps

Now that your dashboard is running, you can:

1. **Explore the Dashboard**
   - Click on any cryptocurrency to see detailed charts
   - Toggle between different timeframes (1D, 7D, 30D, etc.)
   - Switch between dark and light mode

2. **Extend the Features**
   - Implement the Portfolio Tracker
   - Add Watchlist functionality
   - Create the Comparison Mode
   - Add News Feed integration

3. **Deploy to Production**
   - Follow the deployment guide in README.md
   - Deploy to Vercel in minutes

---

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [CoinGecko API Docs](https://www.coingecko.com/en/api/documentation)
- [Neon.tech Docs](https://neon.tech/docs/introduction)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)

---

**Need help?** Check the main README.md or open an issue on GitHub.
