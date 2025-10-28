// Server-side JWT secret
// In production, this should be set via environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Token expiration time (1 day)
const JWT_EXPIRES_IN = '1d';

// Cookie settings
const AUTH_COOKIE_NAME = 'auth_token';
const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24, // 1 day in seconds
  path: '/',
};

export {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_OPTIONS
};