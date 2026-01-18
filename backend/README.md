# FlowDash Backend

Node.js/Express backend with JWT authentication and role-based authorization.

## Quick Start

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | No | Login with email/password |
| `/api/auth/logout` | POST | No | Logout user |
| `/api/auth/me` | GET | Yes | Get current user |
| `/api/auth/verify` | GET | Yes | Verify JWT token |
| `/api/health` | GET | No | Health check |

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Operator | operator@demo.com | demo123 |
| Manager | manager@demo.com | demo123 |
| Director | director@demo.com | demo123 |

## Environment Variables

```env
PORT=3001
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## Deployment

### Railway
1. Push to GitHub
2. Connect repo to Railway
3. Set environment variables
4. Deploy

### Render
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables
