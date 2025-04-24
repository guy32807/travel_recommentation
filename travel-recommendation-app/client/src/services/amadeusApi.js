import axios from 'axios';

// Base URL for our backend proxy
const API_BASE_URL = '/api/external/amadeus';

// Create axios instance
const amadeusApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Amadeus API service
const amadeusApiService = {
  // Flight offers search
  searchFlights: async (params) => {
    try {
      const { originLocationCode, destinationLocationCode, departureDate, returnDate, adults, travelClass } = params;
      
      const response = await amadeusApiClient.get('/flight-offers', {
        params: {
          originLocationCode,
          destinationLocationCode,
          departureDate,
          ...(returnDate && { returnDate }),
          adults: adults || 1,
          ...(travelClass && { travelClass }),
          max: 20
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  },
  
  // Flight price confirmation
  confirmFlightPrice: async (flightOffer) => {
    try {
      const response = await amadeusApiClient.post('/flight-offers/pricing', {
        flightOffers: [flightOffer]
      });
      
      return response.data;
    } catch (error) {
      console.error('Error confirming flight price:', error);
      throw error;
    }
  },
  
  // Hotel search
  searchHotels: async (params) => {
    try {
      const { cityCode, checkInDate, checkOutDate, adults, radius, ratings } = params;
      
      const response = await amadeusApiClient.get('/hotel-offers', {
        params: {
          cityCode,
          checkInDate,
          checkOutDate,
          adults: adults || 1,
          radius: radius || 5,
          radiusUnit: 'KM',
          ...(ratings && { ratings })
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching hotels:', error);
      throw error;
    }
  },
  
  // Get hotel offer details
  getHotelOfferById: async (offerId) => {
    try {
      const response = await amadeusApiClient.get(`/hotel-offers/${offerId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting hotel offer:', error);
      throw error;
    }
  },
  
  // Search airport and city locations
  searchLocations: async (keyword) => {
    try {
      const response = await amadeusApiClient.get('/locations', {
        params: {
          keyword,
          subType: 'CITY,AIRPORT'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error searching locations:', error);
      throw error;
    }
  },
  
  // Get flight destination recommendations
  getFlightDestinations: async (params) => {
    try {
      const { origin, oneWay, duration, nonStop, viewBy } = params;
      
      const response = await amadeusApiClient.get('/destinations', {
        params: {
          origin,
          oneWay: oneWay || false,
          duration: duration || '30',
          nonStop: nonStop || false,
          viewBy: viewBy || 'DESTINATION'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting flight destinations:', error);
      throw error;
    }
  },
  
  // Get flight price analysis
  getFlightPriceAnalysis: async (params) => {
    try {
      const { originIataCode, destinationIataCode, departureDate, currencyCode } = params;
      
      const response = await amadeusApiClient.get('/flight-price-analysis', {
        params: {
          originIataCode,
          destinationIataCode,
          departureDate,
          currencyCode: currencyCode || 'USD'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error getting flight price analysis:', error);
      throw error;
    }
  }
};

export default amadeusApiService;