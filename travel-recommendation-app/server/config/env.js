const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Try to find the .env file in different locations
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '../.env'),
  path.resolve(__dirname, '../.env'),
];

let envFound = false;
let envPath = null;

for (const possiblePath of envPaths) {
  if (fs.existsSync(possiblePath)) {
    console.log(`Found .env file at: ${possiblePath}`);
    dotenv.config({ path: possiblePath });
    envFound = true;
    envPath = possiblePath;
    break;
  }
}

if (!envFound) {
  console.warn('No .env file found! Using default environment variables.');
}

// Required environment variables
const required = [
  'MONGODB_URI'
];

// Check required variables
required.forEach(variable => {
  if (!process.env[variable]) {
    console.warn(`Warning: Environment variable ${variable} is not set!`);
  }
});

// Default values for optional variables
const defaults = {
  PORT: 5002,
  NODE_ENV: 'development',
  CLIENT_URL: 'http://localhost:3000',
  AMADEUS_BASE_URL: 'https://test.api.amadeus.com'
};

// Set defaults if not provided
Object.entries(defaults).forEach(([key, value]) => {
  if (!process.env[key]) {
    process.env[key] = value;
  }
});

// Update BASE_URL in your env.js file
const AMADEUS_BASE_URL = process.env.AMADEUS_BASE_URL || 'https://test.api.amadeus.com/v1';

// Temporary fix for Amadeus API credentials
if (!process.env.AMADEUS_API_KEY) {
  console.log('Setting Amadeus credentials with hardcoded values (temporary)');
  process.env.AMADEUS_API_KEY = '0QZQWiPJSrGgNgAAG3YPtOjeybdw8wQm';
  process.env.AMADEUS_API_SECRET = 'aqjF5p6A3RhkAd4J';
}

// Add debug output for environment variables
console.log('Environment configuration:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- MONGODB_URI:', process.env.MONGODB_URI ? '[SET]' : '[NOT SET]');
console.log('- AMADEUS_API_KEY:', process.env.AMADEUS_API_KEY ? process.env.AMADEUS_API_KEY.substring(0, 5) + '...' : '[NOT SET]');
console.log('- AMADEUS_API_SECRET:', process.env.AMADEUS_API_SECRET ? process.env.AMADEUS_API_SECRET.substring(0, 5) + '...' : '[NOT SET]');
console.log('- AMADEUS_BASE_URL:', process.env.AMADEUS_BASE_URL || '[NOT SET]');

module.exports = {
  port: process.env.PORT,
  nodeEnv: process.env.NODE_ENV,
  mongoUri: process.env.MONGODB_URI,
  clientUrl: process.env.CLIENT_URL,
  amadeusApiKey: process.env.AMADEUS_API_KEY,
  amadeusApiSecret: process.env.AMADEUS_API_SECRET,
  amadeusBaseUrl: AMADEUS_BASE_URL,
  path: envPath
};