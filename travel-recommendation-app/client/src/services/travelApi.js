import axios from 'axios';
import apiClient from './apiClient';

// Base URLs for different APIs
const BACKEND_URL = '/api';
const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v1';
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

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
  searchHotels: async (location) => {
    try {
      console.log('[travelApiService] Searching hotels with location:', location);
      
      // Using axios directly instead of apiClient if needed
      const response = await axios.get(`${API_BASE_URL}/external/hotels`, {
        params: { location }
      });
      
      console.log('[travelApiService] Hotel search response:', response.data);
      
      if (!response.data || !Array.isArray(response.data)) {
        console.error('[travelApiService] Invalid hotel data format:', response.data);
        throw new Error('Invalid hotel data received');
      }
      
      return response.data;
    } catch (error) {
      console.error('[travelApiService] Hotel search failed:', error);
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