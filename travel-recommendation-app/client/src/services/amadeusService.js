import apiClient from './apiClient';

const amadeusService = {
  /**
   * Search for locations (cities, airports) by keyword
   * @param {string} keyword - The search term
   * @returns {Promise} - The response from the API
   */
  searchLocations: async (keyword) => {
    try {
      console.log('[amadeusService] Searching locations with keyword:', keyword);
      
      // Make sure we're using the real Amadeus API endpoint
      const response = await apiClient.get('/external/amadeus/locations', {
        params: { keyword }
      });
      
      console.log('[amadeusService] Location search response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[amadeusService] Location search failed:', error);
      throw error;
    }
  },
  
  /**
   * Search for flights
   * @param {Object} params - Flight search parameters
   * @returns {Promise} - The response from the API
   */
  searchFlights: async (params) => {
    try {
      const response = await apiClient.get('/external/amadeus/flight-offers', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },
  
  /**
   * Search for hotels
   * @param {Object} params - Hotel search parameters
   * @returns {Promise} - The response from the API
   */
  searchHotels: async (params) => {
    try {
      console.log('[amadeusService] Searching hotels with params:', params);
      
      // ONLY use the real Amadeus API endpoint, no fallbacks to mock data
      const response = await apiClient.get('/external/amadeus/hotel-offers', {
        params
      });
      
      // Debug logging
      console.log('[amadeusService] Raw hotel search response:', response);
      
      // Make sure we return the data in the expected format
      if (response.data && response.data.data) {
        // This is the correct format from the API
        return response.data;
      } else {
        console.error('[amadeusService] Unexpected response format:', response.data);
        throw new Error('Received invalid hotel data format from API');
      }
    } catch (error) {
      console.error('[amadeusService] Hotel search failed:', error);
      
      // DO NOT fall back to mock data - let the component handle the error
      throw error;
    }
  },
  
  /**
   * Get hotel offer details
   * @param {string} offerId - Hotel offer ID
   * @returns {Promise} - The response from the API
   */
  getHotelOfferById: async (offerId) => {
    try {
      console.log('[amadeusService] Getting hotel offer details for offerId:', offerId);
      
      // Use the real Amadeus endpoint
      const response = await apiClient.get(`/external/amadeus/hotel-offers/${offerId}`);
      
      console.log('[amadeusService] Hotel offer details response:', response.data);
      return response.data;
    } catch (error) {
      console.error('[amadeusService] Failed to get hotel offer details:', error);
      throw error;
    }
  },
  
  /**
   * Get flight price analysis
   * @param {Object} params - Analysis parameters
   * @returns {Promise} - The response from the API
   */
  getFlightPriceAnalysis: async (params) => {
    try {
      const response = await apiClient.get('/external/amadeus/flight-price-analysis', {
        params
      });
      return response.data;
    } catch (error) {
      console.error('Error getting flight price analysis:', error);
      throw error;
    }
  },
  
  /**
   * Get destination recommendations
   * @param {Object} params - Recommendation parameters
   * @returns {Promise} - The response from the API
   */
  getDestinationRecommendations: async (params) => {
    try {
      console.log('[amadeusService] Getting destination recommendations with params:', params);
      
      // Make the API call to the backend endpoint
      const response = await apiClient.get('/external/amadeus/destinations', {
        params
      });
      
      console.log('[amadeusService] Destination recommendations response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[amadeusService] Failed to get destination recommendations:', error);
      throw error;
    }
  }
};

export default amadeusService;