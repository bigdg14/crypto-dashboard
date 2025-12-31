# Database Setup Guide

## Why You Need a Database

The following features require a PostgreSQL database:
- **Portfolio Tracker** - Store your cryptocurrency holdings
- **Watchlist** - Save your favorite coins
- **Price Alerts** - Create price notifications
- **User Sessions** - Keep you logged in

## Quick Setup with Neon.tech (Free)

### Step 1: Create Neon Account
1. Go to https://neon.tech
2. Click "Sign Up" (free forever)
3. Sign up with GitHub, Google, or email

### Step 2: Create Database
1. Click "Create Project"
2. Choose a name (e.g., "crypto-dashboard")
3. Select region closest to you
4. Click "Create Project"

### Step 3: Get Connection String
1. After project creation, you'll see "Connection Details"
2. Select "Pooled connection" (recommended for serverless)
3. Copy the connection string (looks like this):
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/database?sslmode=require
   ```

### Step 4: Update Environment Variable
1. Open `.env.local` in your crypto-dashboard folder
2. Replace the DATABASE_URL line with your connection string:
   ```env
   DATABASE_URL="postgresql://your-actual-connection-string-here"
   ```
3. Save the file

### Step 5: Create Database Tables
Open a terminal in the crypto-dashboard folder and run:
```bash
npm run db:push
```

You should see output like:
```
✅ Created table: users
✅ Created table: accounts
✅ Created table: sessions
✅ Created table: portfolio
✅ Created table: watchlist
✅ Created table: alerts
✅ Created table: verificationToken
```

### Step 6: Restart Development Server
```bash
# Stop the current server (Ctrl+C if running)
npm run dev
```

### Step 7: Test It!
1. Go to http://localhost:3000
2. Click "Sign In" and enter any email
3. Try adding a coin to your watchlist
4. Should work! ✅

---

## Alternative: Local PostgreSQL

If you prefer to run PostgreSQL locally:

### Windows (PostgreSQL)
1. Download from https://www.postgresql.org/download/windows/
2. Install PostgreSQL 15 or later
3. During installation, set a password
4. After installation, create a database:
   ```sql
   CREATE DATABASE crypto_dashboard;
   ```
5. Your connection string will be:
   ```
   DATABASE_URL="postgresql://postgres:your-password@localhost:5432/crypto_dashboard"
   ```

### macOS (PostgreSQL)
```bash
# Install via Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb crypto_dashboard

# Connection string
DATABASE_URL="postgresql://localhost:5432/crypto_dashboard"
```

### Docker (All Platforms)
```bash
# Run PostgreSQL in Docker
docker run -d \
  --name crypto-db \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=crypto_dashboard \
  -p 5432:5432 \
  postgres:15

# Connection string
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/crypto_dashboard"
```

Then follow Steps 4-7 above.

---

## Verify Database Connection

Run this command to check if the database is accessible:
```bash
npm run db:studio
```

This opens Drizzle Studio (a database GUI) at http://localhost:4983

You should see all your tables:
- users
- accounts
- sessions
- portfolio
- watchlist
- alerts
- verificationToken

---

## Troubleshooting

### Error: "getaddrinfo ENOTFOUND host"
**Problem**: DATABASE_URL is still the placeholder value

**Solution**: Update `.env.local` with your actual database connection string

### Error: "Connection timeout"
**Problem**: Database is not accessible (firewall, wrong region, etc.)

**Solution**:
- For Neon: Make sure you're using the "Pooled connection" string
- Check if your firewall is blocking port 5432
- Try a different region in Neon

### Error: "relation does not exist"
**Problem**: Database tables haven't been created yet

**Solution**: Run `npm run db:push`

### Error: "password authentication failed"
**Problem**: Wrong password in connection string

**Solution**:
- For Neon: Copy the connection string again from dashboard
- For local: Reset your PostgreSQL password

---

## What's Stored in the Database?

### User Authentication
- **users** - User profiles (email, name, image)
- **accounts** - OAuth accounts (Google, GitHub)
- **sessions** - Active login sessions
- **verificationToken** - Email verification

### Portfolio Tracker
- **portfolio** - Your cryptocurrency holdings
  - Coin ID, symbol, name
  - Amount owned
  - Purchase price
  - Purchase date

### Watchlist
- **watchlist** - Favorite cryptocurrencies
  - Coin ID, symbol, name
  - Date added

### Price Alerts
- **alerts** - Price notifications
  - Coin ID, symbol
  - Target price
  - Condition (above/below)
  - Active status

---

## Security Notes

- ✅ Connection strings include SSL by default (`sslmode=require`)
- ✅ Passwords are never stored (OAuth only)
- ✅ Sessions expire automatically
- ✅ All data is tied to your user account
- ✅ Neon.tech uses industry-standard encryption

---

## Free Tier Limits (Neon.tech)

- **Storage**: 0.5 GB (plenty for this app)
- **Compute**: 191.9 hours/month
- **Data Transfer**: Unlimited
- **Databases**: 10 projects
- **Auto-pause**: After 5 minutes of inactivity (saves compute)

Perfect for development and personal use!

---

**Need Help?**
- Neon Docs: https://neon.tech/docs/introduction
- PostgreSQL Docs: https://www.postgresql.org/docs/
