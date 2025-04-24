// Add this line to import the booking routes
const bookingRoutes = require('./api/routes/bookingRoutes');

// Find where you register routes and add:
app.use('/api/external/booking', bookingRoutes);