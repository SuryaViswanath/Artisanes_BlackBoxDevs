import express from 'express';
import { createUser, findUserByEmail, verifyPassword, toPublicUser } from '../services/users.js';
import { signToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/auth/ping
 */
router.get('/ping', (req, res) => {
  return res.status(200).json({ ok: true });
});

/**
 * POST /api/auth/register
 * Body: { email, password, name?, role? }
 * Returns: { success, user, token }
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body || {};
    const user = await createUser({
      email,
      password,
      name,
      role: role || 'seller',
    });
    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    return res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (err) {
    if (err.message === 'Email and password are required') {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (err.message === 'An account with this email already exists') {
      return res.status(409).json({ success: false, error: err.message });
    }
    console.error('Register error:', err);
    return res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { success, user, token }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    const valid = await verifyPassword(user, password);
    if (!valid) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
    const publicUser = toPublicUser(user);
    const token = signToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    return res.status(200).json({
      success: true,
      user: publicUser,
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Login failed' });
  }
});

/**
 * GET /api/auth/session
 * Header: Authorization: Bearer <token>
 * Returns: { success, loggedIn, user } (user null if no/invalid token)
 */
router.get('/session', optionalAuth, (req, res) => {
  if (!req.user) {
    return res.status(200).json({
      success: true,
      loggedIn: false,
      user: null,
    });
  }
  return res.status(200).json({
    success: true,
    loggedIn: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

/**
 * POST /api/auth/logout
 * Client should discard token; no server-side state for JWT.
 */
router.post('/logout', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default router;
