const express = require('express');
const router = express.Router();
const axios = require('axios');
const env = require('../../config/env');

// In a production app, you would get these from environment variables
const BOOKING_API_KEY = env.bookingApiKey || 'demo_key';
const BOOKING_API_URL = env.bookingApiUrl || 'https://distribution-xml.booking.com/json/bookings';

console.log('\n=== BOOKING.COM API CONFIGURATION ===');
console.log('API Key:', BOOKING_API_KEY ? 'Set (hidden for security)' : 'Not set');
console.log('API URL:', BOOKING_API_URL);
console.log('=======================================\n');

// Helper function to make authenticated Booking.com API requests
const makeBookingRequest = async (endpoint, params = {}) => {
  try {
    const url = `${BOOKING_API_URL}${endpoint}`;
    
    console.log(`[bookingRoutes] Making request to: ${url}`);
    console.log(`[bookingRoutes] With params:`, params);
    
    const config = {
      method: 'GET',
      url,
      params: {
        ...params,
        apiKey: BOOKING_API_KEY
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('[bookingRoutes] API request error:', error.message);
    throw error;
  }
};

// Test endpoint to ensure router is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Booking.com API router is working',
    status: 'OK'
  });
});

// Search for hotels
router.get('/hotels', async (req, res) => {
  try {
    const { 
      destination, 
      checkIn, 
      checkOut, 
      adults = 2, 
      rooms = 1,
      minRating = 0,
      maxPrice,
      amenities
    } = req.query;
    
    if (!destination) {
      return res.status(400).json({ message: 'Destination is required' });
    }
    
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }
    
    console.log(`[bookingRoutes] Searching for hotels in ${destination}`);
    
    try {
      // For demonstration, we'll simulate a Booking.com API response structure
      // Replace this with the actual API call when you have credentials
      
      // This would be your actual API call:
      // const data = await makeBookingRequest('/hotels', {
      //   city: destination,
      //   checkin: checkIn,
      //   checkout: checkOut,
      //   adults_number: adults,
      //   room_number: rooms,
      //   filter_by_currency: 'USD',
      //   order_by: 'popularity',
      //   languagecode: 'en-us',
      //   // additional params based on filters
      // });
      
      // For now, generate a simulated response
      const mockHotels = generateMockHotels(destination, 15);
      
      res.json({
        status: 'success',
        count: mockHotels.length,
        hotels: mockHotels
      });
    } catch (apiError) {
      console.error('[bookingRoutes] Hotel search API error:', apiError);
      
      return res.status(500).json({
        message: 'Failed to fetch hotels from Booking.com',
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('[bookingRoutes] Unexpected error in /hotels endpoint:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred',
      error: error.message
    });
  }
});

// Get hotel details by ID
router.get('/hotels/:hotelId', async (req, res) => {
  try {
    const { hotelId } = req.params;
    
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    console.log(`[bookingRoutes] Getting details for hotel ID: ${hotelId}`);
    
    try {
      // This would be your actual API call:
      // const data = await makeBookingRequest(`/hotels/${hotelId}`, {
      //   languagecode: 'en-us',
      // });
      
      // For demonstration, generate a mock detailed hotel
      const hotel = generateMockHotelDetail(hotelId);
      
      if (!hotel) {
        return res.status(404).json({
          message: 'Hotel not found'
        });
      }
      
      res.json({
        status: 'success',
        hotel
      });
    } catch (apiError) {
      console.error('[bookingRoutes] Hotel detail API error:', apiError);
      
      return res.status(500).json({
        message: 'Failed to fetch hotel details from Booking.com',
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('[bookingRoutes] Unexpected error in /hotels/:hotelId endpoint:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred',
      error: error.message
    });
  }
});

// Get hotel reviews
router.get('/hotels/:hotelId/reviews', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    if (!hotelId) {
      return res.status(400).json({ message: 'Hotel ID is required' });
    }
    
    console.log(`[bookingRoutes] Getting reviews for hotel ID: ${hotelId}`);
    
    try {
      // This would be your actual API call:
      // const data = await makeBookingRequest(`/hotels/${hotelId}/reviews`, {
      //   page,
      //   items_per_page: limit,
      //   languagecode: 'en-us',
      // });
      
      // For demonstration, generate mock reviews
      const reviews = generateMockReviews(hotelId, parseInt(limit));
      
      res.json({
        status: 'success',
        page: parseInt(page),
        limit: parseInt(limit),
        total: 50, // Mock total count
        reviews
      });
    } catch (apiError) {
      console.error('[bookingRoutes] Hotel reviews API error:', apiError);
      
      return res.status(500).json({
        message: 'Failed to fetch hotel reviews from Booking.com',
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('[bookingRoutes] Unexpected error in /hotels/:hotelId/reviews endpoint:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred',
      error: error.message
    });
  }
});

// Helper functions to generate mock data for demonstration
function generateMockHotels(destination, count = 10) {
  const hotelTypes = ['Hotel', 'Resort', 'Apartment', 'Villa', 'Boutique Hotel', 'Hostel'];
  const amenities = ['Free WiFi', 'Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Airport Shuttle', 'Parking'];
  
  return Array.from({ length: count }, (_, i) => {
    const id = `${destination.replace(/\s+/g, '-').toLowerCase()}-${i + 1}`;
    const rating = (Math.random() * 3 + 2).toFixed(1); // 2.0 to 5.0
    const reviewCount = Math.floor(Math.random() * 500) + 50;
    const price = Math.floor(Math.random() * 300) + 50;
    
    return {
      id,
      name: `${destination} ${hotelTypes[i % hotelTypes.length]} ${i + 1}`,
      type: hotelTypes[i % hotelTypes.length],
      address: `${Math.floor(Math.random() * 999) + 1} Main Street, ${destination}`,
      rating: parseFloat(rating),
      reviewCount,
      price: {
        current: price,
        original: price * (Math.random() < 0.3 ? 1.2 : 1), // Some hotels have discounts
        currency: 'USD'
      },
      images: [
        `https://picsum.photos/seed/${id}-1/800/600`,
        `https://picsum.photos/seed/${id}-2/800/600`,
        `https://picsum.photos/seed/${id}-3/800/600`
      ],
      amenities: amenities.slice(0, Math.floor(Math.random() * 5) + 3),
      freeCancellation: Math.random() > 0.5,
      distance: `${(Math.random() * 5).toFixed(1)} km from center`
    };
  });
}

function generateMockHotelDetail(hotelId) {
  const amenities = [
    'Free WiFi', 'Swimming Pool', 'Spa', 'Fitness Center', 'Restaurant', 
    'Room Service', 'Airport Shuttle', 'Parking', 'Air Conditioning',
    'Bar', 'Breakfast Available', 'Business Center', 'Concierge', 
    'Pet Friendly', '24-Hour Front Desk', 'Non-smoking Rooms'
  ];
  
  const roomTypes = [
    { name: 'Standard Double', beds: '1 Queen Bed', size: '25m²', price: 120 },
    { name: 'Deluxe Double', beds: '1 King Bed', size: '30m²', price: 150 },
    { name: 'Twin Room', beds: '2 Single Beds', size: '28m²', price: 130 },
    { name: 'Family Suite', beds: '1 King Bed & 2 Single Beds', size: '40m²', price: 200 },
    { name: 'Executive Suite', beds: '1 King Bed', size: '45m²', price: 250 }
  ];
  
  // Extract destination name from ID (demo-1 becomes "Demo")
  const destinationParts = hotelId.split('-');
  const destination = destinationParts[0].charAt(0).toUpperCase() + destinationParts[0].slice(1);
  
  const rating = (Math.random() * 3 + 2).toFixed(1); // 2.0 to 5.0
  const reviewCount = Math.floor(Math.random() * 500) + 50;
  
  return {
    id: hotelId,
    name: `${destination} Premium Hotel`,
    description: `Experience luxury and comfort at our hotel in the heart of ${destination}. Our hotel offers modern amenities, spacious rooms, and exceptional service to make your stay memorable. Located near major attractions and business districts, it's perfect for both leisure and business travelers.`,
    address: {
      street: `${Math.floor(Math.random() * 999) + 1} Main Avenue`,
      city: destination,
      postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
      country: 'United States'
    },
    coordinates: {
      latitude: (Math.random() * 180 - 90).toFixed(6),
      longitude: (Math.random() * 360 - 180).toFixed(6)
    },
    rating: parseFloat(rating),
    reviewCount,
    starRating: Math.floor(Math.random() * 3) + 3, // 3 to 5 stars
    images: [
      `https://picsum.photos/seed/${hotelId}-main/800/600`,
      `https://picsum.photos/seed/${hotelId}-room/800/600`,
      `https://picsum.photos/seed/${hotelId}-lobby/800/600`,
      `https://picsum.photos/seed/${hotelId}-pool/800/600`,
      `https://picsum.photos/seed/${hotelId}-restaurant/800/600`
    ],
    amenities: [...new Set(amenities.sort(() => 0.5 - Math.random()).slice(0, 10))],
    roomTypes: roomTypes.sort(() => 0.5 - Math.random()).slice(0, 3),
    policies: {
      checkIn: '14:00',
      checkOut: '11:00',
      freeCancellation: Math.random() > 0.5,
      cancellationPolicy: 'Free cancellation up to 48 hours before check-in. After that, the first night is non-refundable.',
      childrenPolicy: 'Children of all ages are welcome.',
      petPolicy: Math.random() > 0.7 ? 'Pets allowed on request' : 'No pets allowed'
    },
    nearbyAttractions: [
      { name: `${destination} Central Park`, distance: '0.5 km' },
      { name: `${destination} Museum of Art`, distance: '1.2 km' },
      { name: `${destination} Shopping Center`, distance: '0.8 km' }
    ]
  };
}

function generateMockReviews(hotelId, count = 10) {
  const reviewTitles = [
    'Great stay!', 'Wonderful experience', 'Excellent service', 
    'Will come back', 'Loved this hotel', 'Perfect location',
    'Disappointing', 'Not as advertised', 'Good value for money',
    'Average stay', 'Very clean', 'Friendly staff'
  ];
  
  const categories = ['Cleanliness', 'Comfort', 'Location', 'Facilities', 'Staff', 'Value for money'];
  
  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Random date in the last 60 days
    
    const overallRating = Math.floor(Math.random() * 5) + 1; // 1 to 5
    
    return {
      id: `review-${hotelId}-${i}`,
      title: reviewTitles[Math.floor(Math.random() * reviewTitles.length)],
      rating: overallRating,
      date: date.toISOString().split('T')[0],
      reviewer: {
        name: `Guest ${String.fromCharCode(65 + i % 26)}`,
        country: 'United States',
        tripType: Math.random() > 0.5 ? 'Business' : 'Leisure'
      },
      stayDuration: `${Math.floor(Math.random() * 7) + 1} nights`,
      room: Math.random() > 0.5 ? 'Standard Room' : 'Deluxe Room',
      categoryRatings: categories.reduce((acc, category) => {
        // Ratings somewhat correlated with overall rating but with some variation
        const categoryRating = Math.max(1, Math.min(5, overallRating + Math.floor(Math.random() * 3) - 1));
        acc[category] = categoryRating;
        return acc;
      }, {}),
      text: `${Math.random() > 0.7 ? 'I really enjoyed my stay at this hotel. ' : ''}${
        Math.random() > 0.5 ? 'The location was perfect for my needs. ' : ''}${
        Math.random() > 0.6 ? 'The staff was very helpful and friendly. ' : ''}${
        Math.random() > 0.5 ? 'The room was clean and comfortable. ' : ''}${
        Math.random() > 0.8 ? 'I would definitely stay here again. ' : ''}`,
      pros: Math.random() > 0.3 ? 'Great location, friendly staff' : undefined,
      cons: Math.random() > 0.7 ? 'Bathroom could be cleaner' : undefined
    };
  });
}

module.exports = router;