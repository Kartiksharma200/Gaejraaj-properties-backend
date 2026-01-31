import dotenv from 'dotenv';
import path from 'path';

// Load .env file from root directory
const envPath = path.resolve(process.cwd(), '.env');
console.log(`📁 Looking for .env at: ${envPath}`);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn('⚠️  .env file not found or error loading it');
  console.warn('   Using default environment variables');
  console.warn('   Create a .env file from .env.example');
} else {
  console.log('✅ .env file loaded successfully');
}

// Get port from env or use fallback
const portFromEnv = process.env.PORT ? parseInt(process.env.PORT) : 5001;
// If port is 5000 (commonly used by macOS Control Center), use 5001 instead
const finalPort = portFromEnv === 5000 ? 5001 : portFromEnv;

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: finalPort,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/backend',
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-min-32-chars-change-this-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
} as const;

// Debug log
console.log('📋 Loaded configuration:');
console.log(`   Port: ${config.port} ${config.port === 5000 ? '(⚠️  Might conflict with macOS Control Center)' : ''}`);
console.log(`   Environment: ${config.nodeEnv}`);
console.log(`   MongoDB: ${config.mongodbUri ? 'Configured' : 'Using default'}`);