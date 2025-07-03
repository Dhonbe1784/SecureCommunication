# Vercel Deployment Guide

## Important Limitations

**WebSocket Features Not Available on Vercel:**
- Real-time chat updates
- Voice calling
- Video calling
- Live notification system

These features require persistent WebSocket connections, which are not supported on Vercel's serverless platform.

## What Works on Vercel

- User authentication (Replit Auth)
- Contact management
- Message sending (without real-time updates)
- Conversation management
- Static file serving

## Deployment Steps

1. **Environment Variables Required:**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `SESSION_SECRET` - Random string for session encryption
   - `REPL_ID` - Your Replit ID for OAuth
   - `REPLIT_DOMAINS` - Your Replit domains for OAuth

2. **Build Configuration:**
   The project includes a `vercel.json` configuration that:
   - Builds the frontend with Vite
   - Serves the API through serverless functions
   - Handles static file serving

3. **Deployment Command:**
   ```bash
   vercel --prod
   ```

## Alternative Deployment Options

For full functionality including WebSocket features, consider:
- **Railway** - Supports WebSocket connections
- **Render** - Supports WebSocket connections
- **Heroku** - Supports WebSocket connections
- **DigitalOcean App Platform** - Supports WebSocket connections

## Testing the Deployment

After deployment:
1. Visit your Vercel URL
2. Test authentication flow
3. Add contacts
4. Send messages (note: no real-time updates)
5. Voice/video call buttons will show limitations message