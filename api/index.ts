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

  // For now, return a simple response indicating WebSocket limitations
  if (req.url?.startsWith('/api')) {
    return res.status(200).json({
      message: 'API endpoint',
      note: 'This is a Vercel deployment. WebSocket features (real-time chat, calls) are not available.',
      availableFeatures: [
        'User authentication',
        'Contact management', 
        'Message sending (no real-time updates)',
        'Conversation management'
      ]
    });
  }

  // Serve static files or redirect to main app
  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SecureChat - Vercel Deployment</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .info { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>SecureChat - Vercel Deployment</h1>
        
        <div class="warning">
          <strong>⚠️ Limited Functionality Notice</strong><br>
          This is a Vercel deployment with limited features. WebSocket-dependent features are not available:
          <ul>
            <li>Real-time chat updates</li>
            <li>Voice calling</li>
            <li>Video calling</li>
            <li>Live notifications</li>
          </ul>
        </div>

        <div class="info">
          <strong>✅ Available Features:</strong>
          <ul>
            <li>User authentication</li>
            <li>Contact management</li>
            <li>Message sending (without real-time updates)</li>
            <li>Conversation management</li>
          </ul>
        </div>

        <p>
          <strong>For full functionality</strong>, deploy to a platform that supports WebSocket connections such as:
          Railway, Render, Heroku, or DigitalOcean App Platform.
        </p>

        <p>
          <a href="https://github.com/your-username/secure-chat" target="_blank">View Source Code</a> |
          <a href="/VERCEL_DEPLOYMENT.md" target="_blank">Deployment Guide</a>
        </p>
      </body>
    </html>
  `);
}

// Auth routes
app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

app.get('/api/login', (req, res) => {
  res.redirect('/api/auth/login');
});

app.get('/api/logout', (req, res) => {
  res.redirect('/api/auth/logout');
});

// Contact routes
app.get('/api/contacts', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const contacts = await storage.getContacts(userId);
    res.json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ message: "Failed to fetch contacts" });
  }
});

app.post('/api/contacts', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    const validatedData = insertContactSchema.parse({
      ...req.body,
      userId
    });

    const contact = await storage.addContact(validatedData);
    res.json(contact);
  } catch (error) {
    console.error("Error adding contact:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid contact data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Failed to add contact" });
    }
  }
});

// Search users
app.get('/api/users/search', isAuthenticated, async (req: any, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: "Email query parameter required" });
    }

    const users = await storage.searchUsersByEmail(email as string);
    res.json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Failed to search users" });
  }
});

// Conversation routes
app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const conversations = await storage.getConversations(userId);
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Failed to fetch conversations" });
  }
});

app.post('/api/conversations', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { participantId } = req.body;
    
    if (!participantId) {
      return res.status(400).json({ message: "Participant ID required" });
    }

    const conversation = await storage.getOrCreateConversation(userId, participantId);
    res.json(conversation);
  } catch (error) {
    console.error("Error creating conversation:", error);
    res.status(500).json({ message: "Failed to create conversation" });
  }
});

// Message routes
app.get('/api/conversations/:id/messages', isAuthenticated, async (req: any, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    
    const messages = await storage.getMessages(conversationId, limit);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

app.post('/api/conversations/:id/messages', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const conversationId = parseInt(req.params.id);
    
    const validatedData = insertMessageSchema.parse({
      ...req.body,
      conversationId,
      senderId: userId
    });

    const message = await storage.addMessage(validatedData);
    res.json(message);
  } catch (error) {
    console.error("Error adding message:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid message data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Failed to add message" });
    }
  }
});

// Call log routes
app.get('/api/call-logs', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const callLogs = await storage.getCallLogs(userId);
    res.json(callLogs);
  } catch (error) {
    console.error("Error fetching call logs:", error);
    res.status(500).json({ message: "Failed to fetch call logs" });
  }
});

app.post('/api/call-logs', isAuthenticated, async (req: any, res) => {
  try {
    const validatedData = insertCallLogSchema.parse(req.body);
    const callLog = await storage.addCallLog(validatedData);
    res.json(callLog);
  } catch (error) {
    console.error("Error adding call log:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid call log data", errors: error.errors });
    } else {
      res.status(500).json({ message: "Failed to add call log" });
    }
  }
});

// Conversation settings
app.put('/api/conversations/:id/clear-settings', isAuthenticated, async (req: any, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    const { autoClearAfter } = req.body;
    
    const conversation = await storage.updateConversationClearSettings(conversationId, autoClearAfter);
    res.json(conversation);
  } catch (error) {
    console.error("Error updating conversation settings:", error);
    res.status(500).json({ message: "Failed to update conversation settings" });
  }
});

app.delete('/api/conversations/:id/messages', isAuthenticated, async (req: any, res) => {
  try {
    const conversationId = parseInt(req.params.id);
    
    await storage.clearConversationMessages(conversationId);
    res.json({ message: "Messages cleared successfully" });
  } catch (error) {
    console.error("Error clearing messages:", error);
    res.status(500).json({ message: "Failed to clear messages" });
  }
});

// Serve static files
app.use(express.static('dist/public'));

app.get('*', (req, res) => {
  res.sendFile(require('path').join(__dirname, '../dist/public/index.html'));
});

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (!res.headersSent) {
    res.status(status).json({ message });
  }
});

export default app;