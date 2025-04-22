import axios from 'axios';

// Base URLs for different APIs
const BACKEND_URL = '/api';
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v1';
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

// Create axios instances for different APIs
const backendApi = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Service to handle all travel-related API calls
const travelApiService = {
  // Functions for your backend API
  getDestinations: async (params) => {
    try {
      const response = await backendApi.get('/recommendations', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  },

  getDestinationById: async (id) => {
    try {
      const response = await backendApi.get(`/recommendations/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching destination ${id}:`, error);
      throw error;
    }
  },

  searchDestinations: async (searchParams) => {
    try {
      const response = await backendApi.get('/recommendations/search', { params: searchParams });
      return response.data;
    } catch (error) {
      console.error('Error searching destinations:', error);
      throw error;
    }
  },

  // Google Places API functions
  searchHotels: async (location, radius = 5000, type = 'lodging') => {
    try {
      // This should go through your backend proxy to protect your API key
      const response = await backendApi.get('/external/places/search', {
        params: {
          location,
          radius,
          type
        }
      });
      return response.data.results;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  },

  getHotelDetails: async (placeId) => {
    try {
      // This should go through your backend proxy
      const response = await backendApi.get('/external/places/details', {
        params: {
          placeId
        }
      });
      return response.data.result;
    } catch (error) {
      console.error(`Error fetching hotel details for ${placeId}:`, error);
      throw error;
    }
  },

  // Functions for Amadeus API
  searchFlights: async (originCode, destinationCode, departureDate, adults = 1) => {
    try {
      // This should go through your backend proxy
      const response = await backendApi.get('/external/flights/search', {
        params: {
          originCode,
          destinationCode,
          departureDate,
          adults
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  }
};

export default travelApiService;