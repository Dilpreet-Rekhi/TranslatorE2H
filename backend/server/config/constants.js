module.exports = {
  PORT: process.env.PORT || 5000,
  ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    TRANSLATOR: 'translator'
  },
  JWT: {
    EXPIRES_IN: '8h',
    ISSUER: 'rajbhasa-translator',
    AUDIENCE: 'web-client'
  },
  MAX_LOGIN_ATTEMPTS: 5,
  ACCOUNT_LOCKOUT_TIME: 30 // minutes
};