const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const recommendationRoutes = require('./api/routes/recommendations');
const externalApiRoutes = require('./api/routes/externalApi');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/external', externalApiRoutes);

// Basic route for testing
app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running' });
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
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;