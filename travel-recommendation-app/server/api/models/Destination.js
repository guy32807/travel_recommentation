const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    country: {
      type: String,
      required: true
    },
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  description: {
    type: String,
    required: true
  },
  images: [String],
  climate: {
    type: String,
    enum: ['tropical', 'temperate', 'arid', 'continental', 'polar'],
    required: true
  },
  budgetLevel: {
    type: String,
    enum: ['budget', 'moderate', 'luxury'],
    required: true
  },
  activities: [String],
  bestTimeToVisit: {
    type: [String],
    enum: ['spring', 'summer', 'fall', 'winter']
  },
  accommodations: [{
    name: String,
    type: String,
    priceRange: String,
    link: String
  }],
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the timestamp when the document is updated
destinationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Destination', destinationSchema);