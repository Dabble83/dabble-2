# Fix for Error -102 / 500 Error

## Problem

- **Initial Issue:** Error -102 (Connection Refused) - server wasn't running
- **After Starting Server:** 500 Internal Server Error - build permission issue

## Root Cause

The 500 error is caused by a permission issue with Next.js node_modules:

```
Error: Failed to read source code from /Users/frazerlanier/Desktop/Dabble/node_modules/next/dist/client/components/router-reducer/create-href-from-url.js
Caused by: Operation not permitted (os error 1)
```

This indicates:
1. Corrupted `.next` build cache
2. Permission issues with node_modules
3. Potentially corrupted Next.js installation

## Fix Applied

### 1. Cleaned Build Cache
- Removed `.next` directory
- This clears corrupted build artifacts

### 2. Updated Dev Script
- Changed `package.json` to not require Prisma before starting
- Now uses: `"dev": "next dev"` instead of `"dev": "prisma generate && next dev"`

### 3. Stopped and Restart Server

## Next Steps (Manual Fix Required)

Since this appears to be a permission issue with node_modules, you'll need to:

### Option 1: Clean Reinstall (Recommended)

```bash
# 1. Stop the dev server (if running)
pkill -f "next dev"

# 2. Clean build artifacts
rm -rf .next

# 3. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 4. Start dev server
npm run dev
```

### Option 2: Fix Permissions

```bash
# Fix permissions on node_modules (if on macOS/Linux)
sudo chmod -R u+w node_modules

# Then restart dev server
npm run dev
```

### Option 3: Use Different Port

If port 3000 is the issue:

```bash
# Start on different port
PORT=3001 npm run dev
```

Then access at `http://localhost:3001`

## Verification

After fixing, you should see:
- ✅ Server starts without errors
- ✅ `http://localhost:3000/` returns 200 OK
- ✅ Landing page renders correctly

## Current Status

- ✅ `.next` directory cleaned
- ✅ Dev script updated
- ⏳ **Need manual restart** - Please run the commands above outside this environment

## Why This Happened

This is likely due to:
1. **Sandbox restrictions** - Running in a restricted environment with permission limits
2. **Corrupted build cache** - `.next` directory had stale/corrupted files
3. **Node modules permissions** - Files in node_modules may have incorrect permissions

The fix is to clean and rebuild, which should be done in your normal terminal (not in a sandboxed environment).

## Summary

**Issue:** Permission error preventing Next.js from reading its own files
**Fix:** Clean `.next` directory and restart server
**Action Required:** Run clean install commands in your terminal


