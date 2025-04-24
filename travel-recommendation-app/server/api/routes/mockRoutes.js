const express = require('express');
const router = express.Router();

// Mock data for locations
const mockLocations = [
  {
    type: 'location',
    subType: 'CITY',
    name: 'Brooklyn',
    iataCode: 'BKL',
    address: {
      cityName: 'Brooklyn',
      countryName: 'United States'
    }
  },
  {
    type: 'location',
    subType: 'CITY',
    name: 'Bronx',
    iataCode: 'BRX',
    address: {
      cityName: 'Bronx',
      countryName: 'United States'
    }
  },
  {
    type: 'location',
    subType: 'CITY',
    name: 'Brisbane',
    iataCode: 'BNE',
    address: {
      cityName: 'Brisbane',
      countryName: 'Australia'
    }
  },
  {
    type: 'location',
    subType: 'AIRPORT',
    name: 'Brisbane Airport',
    iataCode: 'BNE',
    address: {
      cityName: 'Brisbane',
      countryName: 'Australia'
    }
  },
  {
    type: 'location',
    subType: 'CITY',
    name: 'Broomfield',
    iataCode: 'BFD',
    address: {
      cityName: 'Broomfield',
      countryName: 'United States'
    }
  },
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
];

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Mock API is working' });
});

// Locations endpoint
router.get('/locations', (req, res) => {
  try {
    const { keyword } = req.query;
    console.log('Mock locations endpoint hit with keyword:', keyword);
    
    if (!keyword || keyword.length < 2) {
      return res.status(400).json({ 
        message: 'Keyword must be at least 2 characters',
        error: 'INVALID_SEARCH'
      });
    }
    
    // Filter locations based on keyword
    const filteredLocations = mockLocations.filter(location => {
      const searchTerm = keyword.toLowerCase();
      return (
        location.name.toLowerCase().includes(searchTerm) ||
        location.iataCode.toLowerCase().includes(searchTerm) ||
        location.address.cityName.toLowerCase().includes(searchTerm) ||
        location.address.countryName.toLowerCase().includes(searchTerm)
      );
    });
    
    console.log(`Found ${filteredLocations.length} mock locations for keyword: ${keyword}`);
    
    // Format response like Amadeus API
    const response = {
      data: filteredLocations,
      meta: {
        count: filteredLocations.length,
        links: {
          self: `http://localhost:5002/api/mock/locations?keyword=${keyword}`
        }
      }
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error in mock locations endpoint:', error);
    return res.status(500).json({
      message: 'An error occurred processing your request',
      error: error.message
    });
  }
});

// Super simple test route - this should be easy to hit
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from mock routes!' });
});

// Add or update the hotels endpoint to handle location-specific data
router.get('/hotels', (req, res) => {
  try {
    const { cityCode, checkInDate, checkOutDate, adults } = req.query;
    console.log('Mock hotels endpoint hit with params:', { cityCode, checkInDate, checkOutDate, adults });
    
    // Define some mock hotel data for different cities
    const mockHotelsData = {
      // New York hotels
      nyc: [
        {
          hotel: {
            name: "Grand Hotel Downtown",
            cityCode: "NYC",
            address: { cityName: "New York", countryCode: "US" },
            rating: "4"
          },
          offers: [
            {
              id: "NYC1001",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Deluxe King Room",
              price: { total: "299.00", currency: "USD" }
            }
          ]
        },
        {
          hotel: {
            name: "Park Avenue Suites",
            cityCode: "NYC",
            address: { cityName: "New York", countryCode: "US" },
            rating: "5"
          },
          offers: [
            {
              id: "NYC1002",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Executive Suite",
              price: { total: "459.00", currency: "USD" }
            }
          ]
        }
      ],
      
      // London hotels
      lon: [
        {
          hotel: {
            name: "Riverside Luxury Hotel",
            cityCode: "LON",
            address: { cityName: "London", countryCode: "GB" },
            rating: "5"
          },
          offers: [
            {
              id: "LON2001",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Premium Room with Thames View",
              price: { total: "279.00", currency: "GBP" }
            }
          ]
        },
        {
          hotel: {
            name: "Historic City Hotel",
            cityCode: "LON",
            address: { cityName: "London", countryCode: "GB" },
            rating: "4"
          },
          offers: [
            {
              id: "LON2002",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Standard Double Room",
              price: { total: "189.00", currency: "GBP" }
            }
          ]
        }
      ],
      
      // Sydney hotels
      syd: [
        {
          hotel: {
            name: "Harbour View Hotel",
            cityCode: "SYD",
            address: { cityName: "Sydney", countryCode: "AU" },
            rating: "5"
          },
          offers: [
            {
              id: "SYD3001",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Deluxe Suite with Opera House View",
              price: { total: "389.00", currency: "AUD" }
            }
          ]
        },
        {
          hotel: {
            name: "Bondi Beach Resort",
            cityCode: "SYD",
            address: { cityName: "Sydney", countryCode: "AU" },
            rating: "4"
          },
          offers: [
            {
              id: "SYD3002",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Oceanfront Room",
              price: { total: "259.00", currency: "AUD" }
            }
          ]
        }
      ],
      
      // Paris hotels
      par: [
        {
          hotel: {
            name: "Eiffel View Hotel",
            cityCode: "PAR",
            address: { cityName: "Paris", countryCode: "FR" },
            rating: "5"
          },
          offers: [
            {
              id: "PAR4001",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Luxury Suite with Eiffel Tower View",
              price: { total: "459.00", currency: "EUR" }
            }
          ]
        },
        {
          hotel: {
            name: "Left Bank Boutique Hotel",
            cityCode: "PAR",
            address: { cityName: "Paris", countryCode: "FR" },
            rating: "4"
          },
          offers: [
            {
              id: "PAR4002",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Classic Double Room",
              price: { total: "219.00", currency: "EUR" }
            }
          ]
        }
      ],
      
      // Default hotels (used when no matching city is found)
      default: [
        {
          hotel: {
            name: "International Grand Hotel",
            cityCode: cityCode || "---",
            address: { cityName: cityCode || "Unknown City", countryCode: "US" },
            rating: "4"
          },
          offers: [
            {
              id: "DEF5001",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Standard Room",
              price: { total: "199.00", currency: "USD" }
            }
          ]
        },
        {
          hotel: {
            name: "Downtown Plaza Hotel",
            cityCode: cityCode || "---",
            address: { cityName: cityCode || "Unknown City", countryCode: "US" },
            rating: "3"
          },
          offers: [
            {
              id: "DEF5002",
              checkInDate: checkInDate,
              checkOutDate: checkOutDate,
              roomDescription: "Budget Room",
              price: { total: "129.00", currency: "USD" }
            }
          ]
        }
      ]
    };
    
    // Determine which hotels to return based on the city code
    let selectedHotels;
    
    if (!cityCode) {
      console.log('No city code provided, using default hotels');
      selectedHotels = mockHotelsData.default;
    } else {
      const normalizedCityCode = cityCode.toLowerCase();
      console.log('Looking for hotels in city:', normalizedCityCode);
      
      // Check if we have specific hotels for this city
      if (mockHotelsData[normalizedCityCode]) {
        selectedHotels = mockHotelsData[normalizedCityCode];
      } else {
        // If no specific hotels for this city, use the default hotels but update the city name
        selectedHotels = mockHotelsData.default.map(hotel => {
          return {
            ...hotel,
            hotel: {
              ...hotel.hotel,
              cityCode: cityCode,
              address: { ...hotel.hotel.address, cityName: cityCode }
            }
          };
        });
      }
    }
    
    console.log(`Returning ${selectedHotels.length} mock hotels for ${cityCode || 'default'}`);
    
    // Format response in Amadeus API format
    const response = {
      data: selectedHotels,
      meta: {
        count: selectedHotels.length,
        source: 'mock',
        cityCode: cityCode
      }
    };
    
    return res.json(response);
  } catch (error) {
    console.error('Error in mock hotels endpoint:', error);
    return res.status(500).json({
      message: 'An error occurred processing your hotel request',
      error: error.message
    });
  }
});

module.exports = router;