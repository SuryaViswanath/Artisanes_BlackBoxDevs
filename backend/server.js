import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import uploadRoutes from './routes/upload.js';
import productRoutes from './routes/products.js';
import conversationRoutes from './routes/conversation.js';
import authRoutes from './routes/auth.js';
import { ensureUsersTable } from './services/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`);
  });
  next();
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/products', productRoutes);
app.use('/api/conversation', conversationRoutes);
// GET /api/auth - sanity check that auth is loaded (must be before mounting auth router)
// app.get('/api/auth', (req, res) => {
//   res.json({ ok: true, routes: ['session', 'login', 'logout'] });
// });
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// 404 handler (must be last) - return JSON and log so we can see missed routes
app.use((req, res) => {
  console.warn(`[404] ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Not Found', path: req.originalUrl, method: req.method });
});

async function start() {
  if (process.env.DYNAMODB_USERS_TABLE) {
    try {
      await ensureUsersTable();
    } catch (err) {
      console.warn('Users table check failed (auth may fail until table exists):', err.message);
    }
  }
  app.listen(PORT, () => {
    console.log('---');
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log('  Health:  GET /api/health');
    console.log('  Auth:   POST /api/auth/register, POST /api/auth/login, GET /api/auth/session, POST /api/auth/logout');
    console.log('  Products: GET /api/products, GET /api/products/:id');
    console.log('  Upload:  POST /api/upload/generate-listing');
    console.log('  Conversation: POST /api/conversation/start, POST /api/conversation/message, GET /api/conversation/:id');
    console.log('---');
  });
}

start();
