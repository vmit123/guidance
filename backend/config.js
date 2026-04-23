require('dotenv').config();

module.exports = {
  dbUrl: process.env.DATABASE_URL || 'sqlite:./career_advisor.db',
  secretKey: process.env.SECRET_KEY || 'your-super-secret-key-here-change-this-in-production',
  algorithm: 'HS256',
  accessTokenExpireMinutes: 30,
  port: process.env.PORT || 8000,
  corsOrigins: ['http://localhost:3000', 'http://localhost:3001'],
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
};
