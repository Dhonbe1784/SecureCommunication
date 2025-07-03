# Vercel Deployment Guide

## 🚨 Important Notice

**This SecureChat application is NOT fully compatible with Vercel** due to WebSocket requirements. The deployment will show a limitations page explaining the missing features.

## Missing Features on Vercel

- ❌ Real-time chat updates (requires WebSocket)
- ❌ Voice calling (requires WebSocket + WebRTC)
- ❌ Video calling (requires WebSocket + WebRTC)
- ❌ Live notifications (requires WebSocket)

## Quick Deployment Steps

1. **Connect to Vercel:**
   ```bash
   vercel login
   vercel link
   ```

2. **Set Environment Variables in Vercel Dashboard:**
   - `DATABASE_URL` - Your PostgreSQL connection string (required)
   - `SESSION_SECRET` - Random string for session encryption
   - `REPL_ID` - Your Replit ID for OAuth
   - `REPLIT_DOMAINS` - Your Replit domains for OAuth

3. **Deploy:**
   ```bash
   vercel --prod
   ```

## What You'll Get

The deployment creates a simple page explaining the WebSocket limitations and why the app won't work fully on Vercel's serverless platform.

## ✅ Recommended Alternatives

For full functionality, deploy to platforms that support WebSocket connections:

| Platform | WebSocket Support | Ease of Use | Cost |
|----------|------------------|-------------|------|
| **Railway** | ✅ Full | Easy | Free tier |
| **Render** | ✅ Full | Easy | Free tier |
| **Fly.io** | ✅ Full | Medium | Free tier |
| **DigitalOcean** | ✅ Full | Medium | $5/month |
| **Heroku** | ✅ Full | Easy | $7/month |

## Railway Deployment (Recommended)

Railway is the best alternative for this app:

1. **Connect Repository:**
   ```bash
   railway login
   railway link
   ```

2. **Add Environment Variables:**
   ```bash
   railway add DATABASE_URL
   railway add SESSION_SECRET
   railway add REPL_ID
   railway add REPLIT_DOMAINS
   ```

3. **Deploy:**
   ```bash
   railway up
   ```

Railway will automatically detect the Node.js app and handle the WebSocket connections properly.