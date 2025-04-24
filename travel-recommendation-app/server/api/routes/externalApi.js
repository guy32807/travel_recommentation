const express = require('express');
const router = express.Router();
const axios = require('axios');
require('dotenv').config();

// Google Places API key
const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
// Amadeus API credentials
const AMADEUS_API_KEY = process.env.AMADEUS_API_KEY;
const AMADEUS_API_SECRET = process.env.AMADEUS_API_SECRET;

let amadeusToken = null;
let tokenExpiry = null;

// Get Amadeus access token
const getAmadeusToken = async () => {
  // Check if we have a valid token
  if (amadeusToken && tokenExpiry && new Date() < tokenExpiry) {
    return amadeusToken;
  }

  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Set token and expiry
    amadeusToken = response.data.access_token;
    // Set expiry time (typically 30 minutes from now)
    tokenExpiry = new Date(new Date().getTime() + response.data.expires_in * 1000);
    
    return amadeusToken;
  } catch (error) {
    console.error('Error getting Amadeus token:', error);
    throw error;
  }
};

// Google Places API routes
router.get('/places/search', async (req, res) => {
  try {
    const { location, radius, type } = req.query;
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location,
        radius,
        type,
        key: GOOGLE_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying Google Places search request:', error);
    res.status(500).json({ error: 'Failed to search places' });
  }
});

router.get('/places/details', async (req, res) => {
  try {
    const { placeId } = req.query;
    
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
      params: {
        place_id: placeId,
        fields: 'name,rating,formatted_address,formatted_phone_number,website,photos,price_level,reviews,opening_hours',
        key: GOOGLE_API_KEY
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying Google Places details request:', error);
    res.status(500).json({ error: 'Failed to get place details' });
  }
});

// Amadeus API routes
router.get('/flights/search', async (req, res) => {
  try {
    const { originCode, destinationCode, departureDate, adults } = req.query;
    
    // Get Amadeus token
    const token = await getAmadeusToken();
    
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      params: {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate,
        adults,
        max: 10
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying Amadeus flight search request:', error);
    res.status(500).json({ error: 'Failed to search flights' });
  }
});

// Add or update the hotels endpoint
router.get('/hotels', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ message: 'Location parameter is required' });
    }
    
    console.log('[externalRoutes] Searching hotels near location:', location);
    
    // Use Google Places API to find real hotels
    const googlePlacesUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ message: 'Google Places API key not configured' });
    }
    
    try {
      const response = await axios.get(googlePlacesUrl, {
        params: {
          location,
          radius: 5000, // 5km radius
          type: 'lodging', // Look for lodging establishments
          key: apiKey
        }
      });
      
      console.log(`[externalRoutes] Found ${response.data.results.length} hotels`);
      
      // Return the actual results from Google Places API
      return res.json(response.data.results);
    } catch (apiError) {
      console.error('[externalRoutes] Google Places API error:', apiError);
      
      return res.status(apiError.response?.status || 500).json({
        message: 'Failed to fetch hotels from Google Places API',
        error: apiError.message
      });
    }
  } catch (error) {
    console.error('[externalRoutes] Unexpected error in /hotels endpoint:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred',
      error: error.message
    });
  }
});

module.exports = router;