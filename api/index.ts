import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // For API endpoints, return a simple JSON response
  if (req.url?.startsWith('/api')) {
    return res.status(200).json({
      message: 'SecureChat API - Limited Vercel Deployment',
      note: 'WebSocket features (real-time chat, calls) are not available on Vercel.',
      availableFeatures: [
        'User authentication',
        'Contact management', 
        'Message sending (no real-time updates)',
        'Conversation management'
      ],
      recommendation: 'Deploy to Railway, Render, or Heroku for full functionality'
    });
  }

  // Serve main application page
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SecureChat - Limited Vercel Deployment</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px; 
            line-height: 1.6;
            color: #333;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
          }
          .info { 
            background: #d1ecf1; 
            border: 1px solid #bee5eb; 
            padding: 20px; 
            border-radius: 8px; 
            margin: 20px 0; 
          }
          .alternatives {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          a {
            color: #007bff;
            text-decoration: none;
          }
          a:hover {
            text-decoration: underline;
          }
          .platform-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 15px 0;
          }
          .platform {
            background: white;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 5px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <h1>🔒 SecureChat - Vercel Deployment</h1>
        
        <div class="warning">
          <strong>⚠️ Limited Functionality Notice</strong><br>
          This SecureChat deployment has limited features because Vercel's serverless platform doesn't support WebSocket connections. Missing features:
          <ul>
            <li>Real-time chat updates</li>
            <li>Voice calling</li>
            <li>Video calling</li>
            <li>Live notifications</li>
          </ul>
        </div>

        <div class="info">
          <strong>✅ What Still Works:</strong>
          <ul>
            <li>User authentication</li>
            <li>Contact management</li>
            <li>Message sending (without real-time updates)</li>
            <li>Conversation management</li>
          </ul>
        </div>

        <div class="alternatives">
          <strong>🚀 For Full Functionality, Deploy To:</strong>
          <div class="platform-list">
            <div class="platform">
              <strong>Railway</strong><br>
              <small>Easy • Free tier • WebSocket support</small>
            </div>
            <div class="platform">
              <strong>Render</strong><br>
              <small>Simple • Free tier • Full features</small>
            </div>
            <div class="platform">
              <strong>Heroku</strong><br>
              <small>Reliable • $7/month • Enterprise ready</small>
            </div>
            <div class="platform">
              <strong>DigitalOcean</strong><br>
              <small>Flexible • $5/month • Full control</small>
            </div>
          </div>
        </div>

        <p style="text-align: center; margin-top: 40px;">
          <a href="https://github.com/Dhonbe1784/SecureCommunication" target="_blank">View Source Code</a> |
          <a href="https://railway.app" target="_blank">Try Railway</a> |
          <a href="https://render.com" target="_blank">Try Render</a>
        </p>
      </body>
    </html>
  `);
}