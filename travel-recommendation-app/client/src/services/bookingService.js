import apiClient from './apiClient';

const bookingService = {
  /**
   * Search for hotels
   * @param {Object} params - Search parameters
   * @returns {Promise} - The response from the API
   */
  searchHotels: async (params) => {
    try {
      console.log('[bookingService] Searching hotels with params:', params);
      
      const response = await apiClient.get('/external/booking/hotels', {
        params
      });
      
      console.log('[bookingService] Hotel search response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[bookingService] Hotel search failed:', error);
      throw error;
    }
  },
  
  /**
   * Get hotel details by ID
   * @param {string} hotelId - The ID of the hotel
   * @returns {Promise} - The response from the API
   */
  getHotelDetails: async (hotelId) => {
    try {
      console.log('[bookingService] Getting hotel details for:', hotelId);
      
      const response = await apiClient.get(`/external/booking/hotels/${hotelId}`);
      
      console.log('[bookingService] Hotel details response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[bookingService] Getting hotel details failed:', error);
      throw error;
    }
  },
  
  /**
   * Get hotel reviews
   * @param {string} hotelId - The ID of the hotel
   * @param {Object} params - Additional parameters like page and limit
   * @returns {Promise} - The response from the API
   */
  getHotelReviews: async (hotelId, params = {}) => {
    try {
      console.log('[bookingService] Getting hotel reviews for:', hotelId);
      
      const response = await apiClient.get(`/external/booking/hotels/${hotelId}/reviews`, {
        params
      });
      
      console.log('[bookingService] Hotel reviews response:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('[bookingService] Getting hotel reviews failed:', error);
      throw error;
    }
  }
};

export default bookingService;