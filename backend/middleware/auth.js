import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'artisan-marketplace-dev-secret-change-in-production';

/**
 * Verify JWT from Authorization: Bearer <token> or from body/query (for testing).
 * Attaches req.user = { id, email, name, role } and req.token.
 */
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

/**
 * Optional auth: if valid token present, set req.user; otherwise continue without it.
 */
export function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    req.token = token;
  } catch (_) {
    // ignore invalid token
  }
  next();
}

export function signToken(payload, expiresIn = '7d') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
