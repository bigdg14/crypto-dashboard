# 🚀 Deployment Guide - CryptoTrack Dashboard

## Deploy to Vercel (Recommended)

Vercel is the easiest and fastest way to deploy your Next.js app. It's free for hobby projects!

### Prerequisites
- GitHub account
- Vercel account (sign up at [vercel.com](https://vercel.com))
- Your code pushed to a GitHub repository

---

## Step-by-Step Deployment

### 1. Push to GitHub

If you haven't already:

```bash
cd crypto-dashboard
git init
git add .
git commit -m "Initial commit: CryptoTrack Dashboard"
git branch -M main
git remote add origin https://github.com/your-username/crypto-dashboard.git
git push -u origin main
```

### 2. Set Up Neon.tech Production Database

1. Go to your [Neon.tech Dashboard](https://console.neon.tech)
2. Either use your existing project or create a new one for production
3. Copy the **Production Connection String**
4. Save it for the next step

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure your project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (or leave blank)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

5. Click "Environment Variables" and add:

```env
DATABASE_URL=your-neon-production-connection-string-here
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate-secure-secret-here
```

6. Click "Deploy"

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - What's your project's name? crypto-dashboard
# - In which directory is your code located? ./
# - Want to override settings? N

# Add environment variables
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET

# Deploy to production
vercel --prod
```

### 4. Generate Secure Secrets

**For NEXTAUTH_SECRET:**

```bash
# Mac/Linux
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

### 5. Set Up Database Tables

After deployment, push your database schema to the production database:

```bash
# Update DATABASE_URL in .env.local to your production URL temporarily
npm run db:push

# Or use Drizzle Studio to verify tables
npm run db:studio
```

---

## Environment Variables Reference

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon.tech PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |
| `NEXTAUTH_URL` | Your production URL | `https://cryptotrack.vercel.app` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth (32+ chars) | Generate with `openssl rand -base64 32` |

### Optional

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_COINGECKO_API_KEY` | CoinGecko Pro API key (for higher rate limits) |
| `GOOGLE_CLIENT_ID` | Google OAuth (for authentication) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `GITHUB_ID` | GitHub OAuth (for authentication) |
| `GITHUB_SECRET` | GitHub OAuth secret |
| `NEWS_API_KEY` | For news feed feature |

---

## Post-Deployment Checklist

- [ ] Verify the app loads at your Vercel URL
- [ ] Check that global market stats display correctly
- [ ] Test clicking on a cryptocurrency (e.g., Bitcoin)
- [ ] Verify charts load on the detail page
- [ ] Test theme toggle (dark/light mode)
- [ ] Check mobile responsiveness
- [ ] Monitor API rate limits (CoinGecko free tier)

---

## Custom Domain Setup (Optional)

### Add Your Own Domain

1. In Vercel Dashboard, go to your project
2. Click "Settings" → "Domains"
3. Click "Add"
4. Enter your domain (e.g., `cryptotrack.com`)
5. Follow the DNS configuration instructions
6. Update `NEXTAUTH_URL` environment variable to your new domain

---

## Performance & Monitoring

### Vercel Analytics (Free)

1. In your Vercel dashboard, go to your project
2. Click "Analytics" tab
3. Enable Analytics
4. View real-time performance metrics

### Error Monitoring

Vercel automatically shows errors in the "Logs" tab. Monitor:
- Build errors
- Runtime errors
- API errors

---

## Scaling & Optimization

### CoinGecko API Limits

**Free Tier:** 10-50 calls/minute

To avoid hitting limits:
1. The app already implements caching (60s stale time)
2. Consider upgrading to CoinGecko Pro for production
3. Add `NEXT_PUBLIC_COINGECKO_API_KEY` to env vars

### Database Optimization

Neon.tech free tier includes:
- 0.5 GB storage
- Automatic scaling
- Connection pooling

For high traffic, consider:
- Upgrading to Neon Pro
- Adding database indexes
- Implementing Redis caching

---

## Troubleshooting

### Build Fails

**Error:** "Module not found" or "Cannot find module"

**Solution:**
```bash
# Locally verify the build works
npm run build

# If successful, commit and push changes
git add .
git commit -m "Fix build errors"
git push
```

### Database Connection Error

**Error:** "Error connecting to database"

**Solution:**
1. Verify `DATABASE_URL` in Vercel environment variables
2. Ensure the connection string includes `?sslmode=require`
3. Check Neon.tech dashboard for database status
4. Run `npm run db:push` to create tables

### API Rate Limiting

**Error:** 429 Too Many Requests

**Solution:**
1. Add a CoinGecko Pro API key
2. Increase React Query stale time
3. Implement additional caching layers

### Environment Variables Not Working

**Solution:**
1. Redeploy after adding env vars (Vercel requires redeployment)
2. Check variable names (no typos)
3. Ensure production env vars are set (not just preview)

---

## CI/CD Setup

Vercel automatically deploys on every push to `main`. To customize:

### Production Branch

In Vercel Dashboard → Settings → Git:
- **Production Branch:** `main`
- **Preview Branches:** All branches
- **Ignored Build Step:** (optional) Add custom conditions

### GitHub Actions (Optional)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - run: npm install
    - run: npm run build
    - run: npm run lint
```

---

## Security Best Practices

1. **Never commit `.env.local`** - Already in .gitignore
2. **Rotate secrets regularly** - Update NEXTAUTH_SECRET periodically
3. **Use environment variables** - For all sensitive data
4. **Enable Vercel's security features**:
   - HTTPS (automatic)
   - Security headers
   - DDoS protection

---

## Monitoring Your Deployment

### Vercel Logs

View real-time logs:
```bash
vercel logs
```

### Health Checks

Create a simple health check endpoint:

Create `app/api/health/route.ts`:
```typescript
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() })
}
```

Test: `https://your-app.vercel.app/api/health`

---

## Cost Breakdown

### Free Tier Limits

**Vercel Hobby (Free):**
- 100 GB bandwidth/month
- Unlimited sites
- Automatic HTTPS
- Preview deployments

**Neon.tech Free:**
- 0.5 GB storage
- 10 branches
- Unlimited queries

**CoinGecko Free:**
- 10-50 calls/minute
- No API key needed

### When to Upgrade

Consider paid tiers when you reach:
- 10K+ monthly active users
- Need higher API rate limits
- Require team collaboration features

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Neon.tech Docs](https://neon.tech/docs)
- [CoinGecko API](https://www.coingecko.com/en/api)

---

**🎉 Congratulations on deploying your CryptoTrack Dashboard!**

Your live URL: `https://your-app-name.vercel.app`
