const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Load environment configuration
const env = require('./config/env');

const recommendationRoutes = require('./api/routes/recommendations');
const amadeusRoutes = require('./api/routes/amadeusRoutes');
const mockRoutes = require('./api/routes/mockRoutes');

const app = express();
const PORT = env.port;

// Enhanced CORS configuration for cross-platform support
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL, /\.yourdomain\.com$/] 
    : process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection with fallback options
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry logic could be implemented here
    process.exit(1);
  }
};

connectDB();

// API Routes
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/external/amadeus', amadeusRoutes);
app.use('/api/mock', mockRoutes);

// Enhanced route registration logging - add this after your routes are registered
console.log('\n=== REGISTERED ROUTES ===');
const printRoutes = (stack, basePath = '') => {
  stack.forEach(layer => {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .filter(method => layer.route.methods[method])
        .map(method => method.toUpperCase())
        .join(',');
      console.log(`${methods} ${basePath}${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      // Extract base path from regexp
      let routerPath = '';
      if (layer.regexp) {
        const match = layer.regexp.toString().match(/^\/\^\\\/([^\\]+)/);
        if (match) {
          routerPath = `/${match[1]}`;
        }
      }
      console.log(`Router: ${routerPath}`);
      printRoutes(layer.handle.stack, basePath + routerPath);
    }
  });
};

printRoutes(app._router.stack);
console.log('=========================\n');

// Test route to ensure the server is working and to get debug info
app.get('/api/debug', (req, res) => {
  try {
    const routesInfo = [];
    
    app._router.stack.forEach(r => {
      if (r.route && r.route.path) {
        routesInfo.push({
          type: 'route',
          method: r.route.stack[0].method.toUpperCase(),
          path: r.route.path
        });
      } else if (r.name === 'router' && r.handle.stack) {
        const prefix = r.regexp.toString().replace('\\/?(?=\\/|$)/i', '').replace(/^\\\//, '/').replace(/\\\//g, '/');
        r.handle.stack.forEach(layer => {
          if (layer.route) {
            const method = layer.route.stack[0].method.toUpperCase();
            const path = layer.route.path;
            routesInfo.push({
              type: 'router route',
              method,
              path: `${prefix}${path}`
            });
          }
        });
      }
    });
    
    res.json({
      serverStatus: 'running',
      port: PORT,
      routesRegistered: routesInfo,
      currentTime: new Date().toISOString(),
      environmentVars: {
        NODE_ENV: process.env.NODE_ENV,
        AMADEUS_API_KEY_SET: !!process.env.AMADEUS_API_KEY,
        AMADEUS_API_SECRET_SET: !!process.env.AMADEUS_API_SECRET,
        MONGODB_URI_SET: !!process.env.MONGODB_URI
      }
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
  });
});

console.log('Checking environment variables:');
console.log('- AMADEUS_API_KEY:', process.env.AMADEUS_API_KEY ? 'Set (starts with ' + process.env.AMADEUS_API_KEY.substring(0, 3) + '...)' : 'NOT SET');
console.log('- AMADEUS_API_SECRET:', process.env.AMADEUS_API_SECRET ? 'Set (starts with ' + process.env.AMADEUS_API_SECRET.substring(0, 3) + '...)' : 'NOT SET');
console.log('- AMADEUS_BASE_URL:', process.env.AMADEUS_BASE_URL || 'NOT SET');

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Amadeus API configured:', !!process.env.AMADEUS_API_KEY);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

module.exports = app;