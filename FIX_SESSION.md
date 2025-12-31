# How to Fix "Failed to add to Watchlist" Error

## The Problem

You have an old session stored in your browser with user ID "1" (which is not a valid UUID). The new authentication system creates proper UUID user IDs in the database.

## Quick Fix (2 Steps)

### Option 1: Sign Out and Sign In Again (Easiest)

1. **Go to** http://localhost:3000
2. **Click your user menu** (top right, shows your email)
3. **Click "Sign Out"**
4. **Click "Sign In"** again
5. **Enter any email** (e.g., test@example.com)
6. **Enter any password**
7. **Done!** The watchlist should work now

### Option 2: Clear Browser Storage

1. **Go to** http://localhost:3000
2. **Open DevTools** (Press F12)
3. **Go to Application tab** (Chrome) or Storage tab (Firefox)
4. **Click "Clear site data"** or delete cookies/localStorage for localhost:3000
5. **Refresh the page**
6. **Sign in again**

## How to Test

After signing out and back in:

1. **Dashboard Star Icon**:
   - Go to http://localhost:3000
   - Click any star icon in the coins table
   - Should see "Added to watchlist" toast
   - Star turns yellow/filled

2. **Coin Detail Page**:
   - Click on any cryptocurrency name
   - Click "Add to Watchlist" button
   - Should work!

3. **View Watchlist**:
   - Click "Watchlist" in navigation
   - See all your added coins

## Why This Happened

The first time you signed in, the authentication system created a temporary user with ID "1". The database schema was updated to use proper UUIDs. Now when you sign in, the system:

1. Checks if your email exists in the database
2. If not, creates a new user with a proper UUID
3. If yes, uses the existing user's UUID

All database operations (portfolio, watchlist, alerts) require proper UUIDs to work correctly.

## Verification

After signing out and back in, open DevTools and run:
```javascript
// This should show your session with a proper UUID
fetch('/api/auth/session').then(r => r.json()).then(console.log)
```

You should see something like:
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",  // ← Proper UUID!
    "email": "test@example.com",
    "name": "test"
  }
}
```

If you still see `"id": "1"`, clear your browser data completely and try again.

---

**Status**: This is a one-time fix needed after the authentication upgrade.
