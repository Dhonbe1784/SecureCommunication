# SecureChat - Real-Time Communication Platform

A modern, full-stack real-time communication platform built with React, Express, and PostgreSQL. SecureChat provides secure messaging, voice calls, and video calls with WebRTC technology.

## Features

- **Real-time Messaging**: Instant messaging with WebSocket connections
- **Voice & Video Calls**: WebRTC-powered peer-to-peer calling
- **User Authentication**: Secure authentication with Replit Auth
- **Contact Management**: Add contacts by email search
- **Conversation Settings**: Auto-clearing messages with customizable timeframes
- **Responsive Design**: Mobile-first approach with desktop enhancements
- **End-to-End Security**: Secure communication protocols

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- shadcn/ui component library
- TanStack Query for state management
- Wouter for routing

### Backend
- Node.js with Express.js
- TypeScript
- WebSocket for real-time communication
- WebRTC for voice/video calls
- Replit Auth with OpenID Connect

### Database
- PostgreSQL with Neon serverless
- Drizzle ORM for type-safe queries
- Session storage with connect-pg-simple

## Getting Started

### Prerequisites
- Node.js 20 or higher
- PostgreSQL database
- Replit account (for authentication)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/securechat.git
cd securechat
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret
REPL_ID=your_replit_app_id
ISSUER_URL=https://replit.com/oidc
REPLIT_DOMAINS=your-replit-domain.replit.app
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Deployment

### Replit Deployment (Recommended)
1. Import this repository to Replit
2. Configure environment variables in Replit Secrets
3. Run the application using the "Start application" workflow

### Manual Deployment
1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
securechat/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Page components
│   └── index.html
├── server/                # Express backend
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data access layer
│   └── replitAuth.ts     # Authentication setup
├── shared/               # Shared types and schemas
│   └── schema.ts        # Database schema
└── package.json
```

## API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Initiate login flow
- `GET /api/logout` - Logout user

### Conversations
- `GET /api/conversations` - Get user conversations
- `POST /api/conversations` - Create conversation
- `GET /api/conversations/:id/messages` - Get conversation messages
- `POST /api/conversations/:id/messages` - Send message
- `DELETE /api/conversations/:id/messages` - Clear all messages

### Contacts
- `GET /api/contacts` - Get user contacts
- `POST /api/contacts` - Add contact
- `GET /api/users/search` - Search users by email

### Call Logs
- `GET /api/call-logs` - Get call history
- `POST /api/call-logs` - Create call log

## WebSocket Events

### Call Signaling
- `call-start` - Initiate voice/video call
- `call-accept` - Accept incoming call
- `call-reject` - Reject incoming call
- `call-end` - End active call
- `offer` - WebRTC offer
- `answer` - WebRTC answer
- `ice-candidate` - ICE candidate exchange

### Real-time Messaging
- `message` - Send/receive messages
- `typing` - Typing indicators

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Replit's development platform
- UI components from shadcn/ui
- Icons from Lucide React
- WebRTC implementation using native browser APIs