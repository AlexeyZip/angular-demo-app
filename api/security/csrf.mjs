import crypto from 'node:crypto';

const CSRF_COOKIE = 'XSRF-TOKEN';

export function issueCsrfToken(res) {
  const token = crypto.randomBytes(24).toString('hex');
  res.cookie(CSRF_COOKIE, token, {
    sameSite: 'lax',
    secure: false,
    httpOnly: false,
    maxAge: 1000 * 60 * 60 * 8,
  });
  return token;
}

export function csrfProtection(req, res, next) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    next();
    return;
  }

  if (req.path === '/api/security/csrf-token') {
    next();
    return;
  }

  const cookieToken = req.cookies?.[CSRF_COOKIE];
  const headerToken = req.headers['x-csrf-token'];

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    res.status(403).json({ message: 'CSRF validation failed' });
    return;
  }
  next();
}
