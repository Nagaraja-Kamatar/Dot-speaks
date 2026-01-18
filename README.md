# FlowDash - Full-Stack Project

A modern SaaS task & work management platform with role-based authentication.

![FlowDash](https://img.shields.io/badge/FlowDash-WorkWise-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)

---

## 📁 Full-Stack Project Structure

```
flowdash-project/
│
├── frontend/                    # React + Vite (This Lovable project)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── ui/              # Reusable UI components
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Performance.tsx
│   │   │   ├── Assessment.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── Profile.tsx
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── data/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
│
├── backend/                     # Node.js + Express (Create separately)
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controller.js
│   │   ├── routes/
│   │   │   └── auth.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   └── user.model.js
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start

### Frontend (Lovable / Local)

```bash
git clone <your-repo-url>
cd flowdash-project/frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend (Node.js + Express)

```bash
cd backend
cp .env.example .env
npm install
npm run dev
# Runs on http://localhost:5000
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Operator | `operator@demo.com` | `demo123` |
| Manager | `manager@demo.com` | `demo123` |
| Director | `director@demo.com` | `demo123` |

---

## 📦 Backend Setup

### 1. `backend/package.json`

```json
{
  "name": "flowdash-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "jsonwebtoken": "^9.0.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

### 2. `backend/.env.example`

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### 3. `backend/src/server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);

app.listen(PORT, () => console.log(`🚀 API running on port ${PORT}`));
```

### 4. `backend/src/routes/auth.routes.js`

```javascript
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
```

### 5. `backend/src/controllers/auth.controller.js`

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USERS = {
  'operator@demo.com': { id: '1', email: 'operator@demo.com', name: 'Alex Operator', role: 'operator', password: bcrypt.hashSync('demo123', 10) },
  'manager@demo.com': { id: '2', email: 'manager@demo.com', name: 'Sarah Manager', role: 'manager', password: bcrypt.hashSync('demo123', 10) },
  'director@demo.com': { id: '3', email: 'director@demo.com', name: 'Michael Director', role: 'director', password: bcrypt.hashSync('demo123', 10) }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = USERS[email?.toLowerCase()];
  
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
  const { password: _, ...userData } = user;
  
  res.json({ success: true, data: { user: userData, token } });
};

exports.getProfile = (req, res) => {
  const user = USERS[req.user.email];
  const { password: _, ...userData } = user;
  res.json({ success: true, data: userData });
};
```

### 6. `backend/src/middleware/auth.middleware.js`

```javascript
const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    req.user = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
```

---

## 👥 Role Permissions

| Feature | Operator | Manager | Director |
|---------|----------|---------|----------|
| View Dashboard | ✅ | ✅ | ✅ |
| View Tasks | ✅ | ✅ | ✅ |
| Edit Tasks | ❌ | ✅ | ✅ |
| Manage Team | ❌ | ✅ | ✅ |
| View Reports | ❌ | ✅ | ✅ |
| Export Data | ❌ | ❌ | ✅ |

---

## 🚀 Deployment

### Frontend - Vercel
```bash
npm i -g vercel && vercel
```

### Frontend - Netlify
```bash
npm run build && netlify deploy --prod --dir=dist
```

### Backend - Railway/Render
1. Push to GitHub
2. Connect to Railway or Render
3. Set environment variables
4. Deploy

---

## 💡 Recommended: Lovable Cloud

For simpler full-stack without a separate backend, enable **Lovable Cloud** to get:
- ✅ PostgreSQL database
- ✅ User authentication
- ✅ Edge functions (serverless)
- ✅ File storage

---

## 📄 License

MIT License

---

Built with ❤️ using [Lovable](https://lovable.dev)
