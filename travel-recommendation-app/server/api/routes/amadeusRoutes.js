const express = require('express');
const router = express.Router();
const axios = require('axios');
const env = require('../../config/env');

// Set Amadeus API credentials - use the env helper
const AMADEUS_API_KEY = env.amadeusApiKey;
const AMADEUS_API_SECRET = env.amadeusApiSecret;
const BASE_URL = env.amadeusBaseUrl || 'https://test.api.amadeus.com/v1';

console.log('\n=== AMADEUS API CREDENTIALS CHECK ===');
if (!AMADEUS_API_KEY) {
  console.error('ERROR: AMADEUS_API_KEY is not set!');
} else {
  console.log('AMADEUS_API_KEY is set');
}

if (!AMADEUS_API_SECRET) {
  console.error('ERROR: AMADEUS_API_SECRET is not set!');
} else {
  console.log('AMADEUS_API_SECRET is set');
}

if (!BASE_URL) {
  console.error('ERROR: BASE_URL is not set, using default');
} else {
  console.log('BASE_URL is set to:', BASE_URL);
}
console.log('=====================================\n');

console.log('In amadeusRoutes.js:');
console.log('- API Key:', AMADEUS_API_KEY.substring(0, 5) + '...');
console.log('- API Secret:', AMADEUS_API_SECRET.substring(0, 5) + '...');
console.log('- Base URL:', BASE_URL);

// Simple test endpoint to verify the router is working
router.get('/test', (req, res) => {
  console.log('Test endpoint hit!');
  res.json({ message: 'Amadeus router is working correctly' });
});

// Token management
let accessToken = null;
let tokenExpiry = null;

// Replace the current getAccessToken function with this implementation
const getAccessToken = async () => {
  console.log('[amadeusRoutes] Getting access token...');
  
  // Check if we have a valid cached token
  if (accessToken && tokenExpiry && new Date() < tokenExpiry) {
    console.log('[amadeusRoutes] Using cached token valid until', tokenExpiry);
    return accessToken;
  }
  
  // Validate credentials are set
  if (!AMADEUS_API_KEY || !AMADEUS_API_SECRET) {
    console.error('[amadeusRoutes] Missing API credentials');
    throw new Error('Amadeus API credentials not configured');
  }
  
  try {
    console.log('[amadeusRoutes] Requesting new token from Amadeus API');
    
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      `grant_type=client_credentials&client_id=${AMADEUS_API_KEY}&client_secret=${AMADEUS_API_SECRET}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    if (!response.data || !response.data.access_token) {
      console.error('[amadeusRoutes] Invalid token response:', response.data);
      throw new Error('Invalid token response from Amadeus API');
    }
    
    accessToken = response.data.access_token;
    tokenExpiry = new Date(new Date().getTime() + (response.data.expires_in * 1000));
    
    console.log('[amadeusRoutes] Got new token, expires:', tokenExpiry);
    return accessToken;
  } catch (error) {
    console.error('[amadeusRoutes] Token request failed:', error);
    throw new Error(`Failed to get access token: ${error.message}`);
  }
};

// Helper function to make authenticated Amadeus API requests
const makeAmadeusRequest = async (method, endpoint, data = null, params = null) => {
  try {
    const token = await getAccessToken();
    
    // Make sure the URL is correctly formatted by removing any duplicate /v1
    let url = BASE_URL;
    if (endpoint.startsWith('/') && BASE_URL.endsWith('/')) {
      url = BASE_URL + endpoint.substring(1);
    } else if (!endpoint.startsWith('/') && !BASE_URL.endsWith('/')) {
      url = BASE_URL + '/' + endpoint;
    } else {
      url = BASE_URL + endpoint;
    }
    
    console.log('Making request to URL:', url);
    
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    if (params) {
      config.params = params;
    }
    
    if (data) {
      config.data = data;
    }
    
    console.log(`Making ${method.toUpperCase()} request to ${url} with:`, { params, data });
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Amadeus API Error:', error.response?.data || error.message);
    throw error;
  }
};

// Add this mock endpoint right before the actual locations endpoint
router.get('/mock-locations', async (req, res) => {
  const { keyword } = req.query;
  console.log('Mock locations endpoint hit with keyword:', keyword);
  
  // Return mock data based on the search term
  res.json({
    data: [
      {
        type: 'location',
        subType: 'CITY',
        name: 'Sydney',
        iataCode: 'SYD',
        address: {
          cityName: 'Sydney',
          countryName: 'Australia'
        }
      },
      {
        type: 'location',
        subType: 'AIRPORT',
        name: 'Sydney Kingsford Smith Airport',
        iataCode: 'SYD',
        address: {
          cityName: 'Sydney',
          countryName: 'Australia'
        }
      }
    ]
  });
});

// LOCATION SEARCH ENDPOINT
router.get('/locations', async (req, res) => {
  try {
    const { keyword } = req.query;
    
    if (!keyword || keyword.length < 2) {
      return res.status(400).json({ message: 'Keyword must be at least 2 characters' });
    }
    
    console.log('[amadeusRoutes] Searching locations with keyword:', keyword);
    
    // Get access token
    let token;
    try {
      token = await getAccessToken();
    } catch (tokenError) {
      console.error('[amadeusRoutes] Failed to get token for location search:', tokenError);
      return res.status(500).json({ 
        message: 'Failed to authenticate with Amadeus API', 
        error: tokenError.message 
      });
    }
    
    // Make the API call to search locations
    try {
      const apiResponse = await axios({
        method: 'get',
        url: 'https://test.api.amadeus.com/v1/reference-data/locations',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          keyword,
          subType: 'CITY,AIRPORT'
        }
      });
      
      console.log(`[amadeusRoutes] Found ${apiResponse.data.data.length} locations`);
      
      return res.json(apiResponse.data);
    } catch (apiError) {
      console.error('[amadeusRoutes] Location search API error:', apiError.message);
      
      if (apiError.response) {
        console.error('API response status:', apiError.response.status);
        console.error('API response data:', apiError.response.data);
      }
      
      return res.status(apiError.response?.status || 500).json({
        message: 'Failed to fetch locations from Amadeus API',
        error: apiError.message,
        details: apiError.response?.data || {}
      });
    }
  } catch (error) {
    console.error('[amadeusRoutes] Unexpected error in /locations endpoint:', error);
    return res.status(500).json({ 
      message: 'An unexpected error occurred', 
      error: error.message 
    });
  }
});

// Helper function to send mock location data
function sendMockLocationData(keyword, res, reason = 'Unknown') {
  console.error(`MOCK DATA DISABLED: Attempted to use mock data for "${keyword}" (Reason: ${reason})`);
  
  // Instead of returning mock data, return an error
  return res.status(500).json({
    error: 'MOCK_DATA_DISABLED',
    message: 'Mock data has been disabled. Please use the real Amadeus API.',
    reason: reason
  });
}

// Add a debug endpoint to test the Amadeus API directly
router.get('/debug-amadeus', async (req, res) => {
  try {
    // First, test the token acquisition
    console.log('DEBUG: Testing token acquisition...');
    const token = await getAccessToken();
    console.log('DEBUG: Successfully acquired token');
    
    // Test the basic API connectivity with a simple endpoint
    console.log('DEBUG: Testing API connectivity...');
    
    // Construct URL manually for debugging
    const baseUrl = 'https://test.api.amadeus.com/v1';
    const endpoint = '/reference-data/locations';
    const fullUrl = `${baseUrl}${endpoint}`;
    
    console.log('DEBUG: Making direct request to:', fullUrl);
    
    const response = await axios({
      method: 'get',
      url: fullUrl,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        keyword: 'LON',
        subType: 'CITY,AIRPORT',
        'page[limit]': 10
      }
    });
    
    console.log('DEBUG: Received response:', {
      status: response.status,
      data: response.data
    });
    
    res.json({
      success: true,
      message: 'Amadeus API test successful',
      data: response.data
    });
  } catch (error) {
    console.error('DEBUG ERROR:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        params: error.config?.params
      }
    });
    
    res.status(500).json({
      success: false,
      message: 'Amadeus API test failed',
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      }
    });
  }
});

// Add this debug endpoint to help troubleshoot Amadeus authentication
router.get('/debug-auth', async (req, res) => {
  try {
    console.log('Testing Amadeus authentication...');
    console.log('API Key:', AMADEUS_API_KEY ? AMADEUS_API_KEY.substring(0, 5) + '...' : 'undefined');
    console.log('API Secret:', AMADEUS_API_SECRET ? AMADEUS_API_SECRET.substring(0, 5) + '...' : 'undefined');
    
    // Try to get a token
    const token = await getAccessToken();
    
    return res.json({
      success: true,
      message: 'Successfully authenticated with Amadeus API',
      tokenInfo: {
        tokenExists: !!token,
        tokenLength: token ? token.length : 0,
        expiresAt: tokenExpiry
      }
    });
  } catch (error) {
    console.error('Authentication test failed:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Amadeus API',
      error: error.message
    });
  }
});

// Add this comprehensive test endpoint
router.get('/test-api', async (req, res) => {
  try {
    // Get the keyword from the query parameters or use a default
    const keyword = req.query.keyword || 'LON';
    const subType = req.query.subType || 'CITY,AIRPORT';
    
    console.log(`Testing Amadeus API with keyword: ${keyword}`);
    
    // Step 1: Get a token
    console.log('Step 1: Getting access token...');
    const token = await getAccessToken();
    console.log('Step 1: Successfully acquired token');
    
    // Step 2: Make a request to a simple endpoint
    console.log('Step 2: Testing API connectivity...');
    const testUrl = 'https://test.api.amadeus.com/v1/reference-data/locations';
    
    console.log('Making request to:', testUrl);
    console.log('With parameters:', {
      keyword,
      subType,
      'page[limit]': 10
    });
    
    const response = await axios({
      method: 'get',
      url: testUrl,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        keyword,
        subType,
        'page[limit]': 10
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    const resultCount = response.data?.data?.length || 0;
    console.log(`Found ${resultCount} results`);
    
    return res.json({
      success: true,
      message: `Amadeus API test completed successfully with ${resultCount} results`,
      parameters: {
        keyword,
        subType
      },
      results: response.data
    });
  } catch (error) {
    console.error('API Test Error:', error);
    console.error('Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config ? {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
        params: error.config.params
      } : 'No config available'
    });
    
    return res.status(500).json({
      success: false,
      message: 'API test failed',
      error: {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      }
    });
  }
});

// Replace or add the hotel-offers endpoint
router.get('/hotel-offers', async (req, res) => {
  try {
    const { cityCode, checkInDate, checkOutDate, adults, roomQuantity } = req.query;
    
    console.log(`[amadeusRoutes] /hotel-offers called with cityCode: ${cityCode}`);
    console.log('[amadeusRoutes] Full params:', req.query);
    
    // Add validation for parameters
    if (!cityCode) {
      console.error('[amadeusRoutes] Missing cityCode');
      return res.status(400).json({ message: 'cityCode is required' });
    }
    
    if (!checkInDate || !checkOutDate) {
      console.error('[amadeusRoutes] Missing date parameters');
      return res.status(400).json({ message: 'checkInDate and checkOutDate are required' });
    }
    
    // Try to get access token
    let token;
    try {
      token = await getAccessToken();
      console.log('[amadeusRoutes] Successfully got Amadeus token for hotel search');
    } catch (tokenError) {
      console.error('[amadeusRoutes] Token error:', tokenError);
      return res.status(500).json({ message: 'Failed to get Amadeus token', error: tokenError.message });
    }
    
    // Call the Amadeus API directly
    try {
      const apiUrl = 'https://test.api.amadeus.com/v2/shopping/hotel-offers';
      console.log(`[amadeusRoutes] Calling Amadeus API at ${apiUrl}`);
      
      const apiResponse = await axios({
        method: 'get',
        url: apiUrl,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          cityCode,
          checkInDate,
          checkOutDate,
          adults: adults || 1,
          roomQuantity: roomQuantity || 1,
          bestRateOnly: true
        }
      });
      
      console.log(`[amadeusRoutes] Amadeus API response status: ${apiResponse.status}`);
      console.log(`[amadeusRoutes] Found ${apiResponse.data?.data?.length || 0} hotels`);
      
      // Return the API response directly
      return res.json(apiResponse.data);
    } catch (apiError) {
      console.error('[amadeusRoutes] Amadeus API error:', apiError);
      
      if (apiError.response) {
        console.error('[amadeusRoutes] Status:', apiError.response.status);
        console.error('[amadeusRoutes] Data:', apiError.response.data);
      }
      
      // Do NOT fall back to mock data - return the error
      return res.status(apiError.response?.status || 500).json({
        message: 'Error fetching hotel data from Amadeus API',
        error: apiError.message,
        details: apiError.response?.data
      });
    }
  } catch (error) {
    console.error('[amadeusRoutes] Unexpected error in /hotel-offers:', error);
    return res.status(500).json({ message: 'Unexpected server error', error: error.message });
  }
});

// Add an endpoint to get a specific hotel offer by ID
router.get('/hotel-offers/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params;
    console.log('[amadeusRoutes] Getting hotel offer details for offerId:', offerId);
    
    if (!offerId) {
      return res.status(400).json({ message: 'Hotel offer ID is required' });
    }
    
    // Get access token
    let token;
    try {
      token = await getAccessToken();
    } catch (tokenError) {
      console.error('[amadeusRoutes] Failed to get token for hotel offer details:', tokenError);
      return res.status(500).json({
        message: 'Failed to authenticate with Amadeus API',
        error: tokenError.message
      });
    }
    
    // Make the API call to get hotel offer details
    try {
      const url = `https://test.api.amadeus.com/v2/shopping/hotel-offers/${offerId}`;
      console.log('[amadeusRoutes] Making request to:', url);
      
      const apiResponse = await axios({
        method: 'get',
        url: url,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(`[amadeusRoutes] Hotel offer details response status: ${apiResponse.status}`);
      return res.json(apiResponse.data);
    } catch (apiError) {
      console.error('[amadeusRoutes] Error getting hotel offer details:', apiError.message);
      
      if (apiError.response) {
        console.error('API response status:', apiError.response.status);
        console.error('API response data:', apiError.response.data);
      }
      
      return res.status(apiError.response?.status || 500).json({
        message: 'Failed to get hotel offer details',
        error: apiError.message,
        details: apiError.response?.data || {}
      });
    }
  } catch (error) {
    console.error('[amadeusRoutes] Unexpected error in hotel-offers/:offerId endpoint:', error);
    return res.status(500).json({
      message: 'An unexpected error occurred',
      error: error.message
    });
  }
});

// Add a debug endpoint to test the hotel search API directly
router.get('/debug-hotels', async (req, res) => {
  try {
    // Use default parameters for testing
    const cityCode = req.query.cityCode || 'PAR';
    const checkInDate = req.query.checkInDate || '2025-05-01';
    const checkOutDate = req.query.checkOutDate || '2025-05-03';
    
    console.log('[DEBUG] Testing hotel search with:', {
      cityCode, checkInDate, checkOutDate
    });
    
    // Get a token
    const token = await getAccessToken();
    console.log('[DEBUG] Successfully got token');
    
    // Make direct API call
    const url = 'https://test.api.amadeus.com/v2/shopping/hotel-offers';
    console.log('[DEBUG] Calling Amadeus API directly:', url);
    
    const apiResponse = await axios({
      method: 'get',
      url: url,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        cityCode,
        checkInDate,
        checkOutDate,
        adults: 1,
        roomQuantity: 1,
        bestRateOnly: true
      }
    });
    
    console.log(`[DEBUG] API response status: ${apiResponse.status}`);
    console.log(`[DEBUG] Found ${apiResponse.data?.data?.length || 0} hotels`);
    
    return res.json({
      success: true,
      message: `Found ${apiResponse.data?.data?.length || 0} hotels for ${cityCode}`,
      parameters: {
        cityCode,
        checkInDate,
        checkOutDate
      },
      data: apiResponse.data
    });
  } catch (error) {
    console.error('[DEBUG] Error testing hotel search:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Hotel search test failed',
      error: error.message,
      details: error.response?.data
    });
  }
});

// Add direct hotel search debug endpoint
router.get('/debug-hotel-search', async (req, res) => {
  try {
    // Get parameters from query string or use defaults
    const cityCode = req.query.cityCode || 'NYC';
    const checkInDate = req.query.checkInDate || '2025-05-01';
    const checkOutDate = req.query.checkOutDate || '2025-05-03';
    
    console.log(`[DEBUG] Testing hotel search with city=${cityCode}`);
    
    // Execute the search with our existing hotel-offers endpoint logic
    let token;
    try {
      token = await getAccessToken();
    } catch (tokenError) {
      return res.json({
        success: false,
        step: 'token',
        error: tokenError.message
      });
    }
    
    // Make a direct call to the Amadeus API
    try {
      const apiUrl = 'https://test.api.amadeus.com/v2/shopping/hotel-offers';
      
      const apiResponse = await axios({
        method: 'get',
        url: apiUrl,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          cityCode,
          checkInDate,
          checkOutDate,
          adults: 1,
          roomQuantity: 1,
          bestRateOnly: true
        }
      });
      
      return res.json({
        success: true,
        message: `Found ${apiResponse.data?.data?.length || 0} hotels for ${cityCode}`,
        data: apiResponse.data
      });
    } catch (apiError) {
      return res.json({
        success: false,
        step: 'api_call',
        error: apiError.message,
        status: apiError.response?.status,
        details: apiError.response?.data
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      step: 'unexpected',
      error: error.message
    });
  }
});

// Add or update the destinations endpoint
router.get('/destinations', async (req, res) => {
  try {
    const { keyword, originCityCode, destinationTypes, maxPrice } = req.query;
    
    console.log('[amadeusRoutes] Fetching destinations with params:', { 
      keyword, originCityCode, destinationTypes, maxPrice 
    });
    
    // Get access token
    let token;
    try {
      token = await getAccessToken();
    } catch (tokenError) {
      console.error('[amadeusRoutes] Failed to get token for destinations:', tokenError);
      return res.status(500).json({ 
        message: 'Failed to authenticate with Amadeus API', 
        error: tokenError.message 
      });
    }
    
    // Prepare API URL and parameters
    let apiUrl = 'https://test.api.amadeus.com/v1';
    let endpoint = '/reference-data/recommended-locations';
    let params = {};
    
    if (keyword) {
      // If we have a keyword, use the locations search endpoint
      endpoint = '/reference-data/locations';
      params = {
        keyword,
        subType: destinationTypes || 'CITY,AIRPORT',
        'page[limit]': 10
      };
    } else {
      // Otherwise use the recommended locations endpoint
      params = {
        cityCodes: originCityCode || 'PAR',
        travelerCountryCode: 'US'
      };
      
      if (destinationTypes) {
        params.destinationTypes = destinationTypes;
      }
    }
    
    const fullUrl = `${apiUrl}${endpoint}`;
    console.log('[amadeusRoutes] Making API call to:', fullUrl);
    console.log('[amadeusRoutes] With parameters:', params);
    
    try {
      const apiResponse = await axios({
        method: 'get',
        url: fullUrl,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params
      });
      
      console.log(`[amadeusRoutes] Found ${apiResponse.data.data.length} destinations`);
      
      return res.json(apiResponse.data);
    } catch (apiError) {
      console.error('[amadeusRoutes] Destination API error:', apiError.message);
      
      if (apiError.response) {
        console.error('API response status:', apiError.response.status);
        console.error('API response data:', apiError.response.data);
      }
      
      return res.status(apiError.response?.status || 500).json({
        message: 'Failed to fetch destinations from Amadeus API',
        error: apiError.message,
        details: apiError.response?.data || {}
      });
    }
  } catch (error) {
    console.error('[amadeusRoutes] Unexpected error in /destinations endpoint:', error);
    return res.status(500).json({ 
      message: 'An unexpected error occurred', 
      error: error.message 
    });
  }
});

// Add more endpoint handlers here

module.exports = router;