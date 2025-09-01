export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/argan',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'argan=-+rDCJJZlx9bMTkuof',
    expiresIn: process.env.JWT_EXPIRES_IN || '155d',
  },
  brevo: {
    apiKey: process.env.BREVO_API_KEY,
  },
  email: {
    senderEmail: process.env.SENDER_EMAIL || 'noreply@argan.com',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    resetPasswordUrl:
      process.env.RESET_PASSWORD_URL ||
      process.env.FRONTEND_URL ||
      'http://localhost:3000',
    verificationUrl:
      process.env.VERIFICATION_URL ||
      process.env.FRONTEND_URL ||
      'http://localhost:3000',
    templates: {
      verification:
        parseInt(process.env.BREVO_VERIFICATION_TEMPLATE_ID, 10) || 1,
      passwordReset:
        parseInt(process.env.BREVO_PASSWORD_RESET_TEMPLATE_ID, 10) || 2,
    },
  },
});
