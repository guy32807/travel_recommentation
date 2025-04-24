import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LocationSearch from './LocationSearch';
import HotelCard from './HotelCard';
import amadeusService from '../services/amadeusService';
import { format } from 'date-fns';

const HotelSearch = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  const [numberOfAdults, setNumberOfAdults] = useState(2);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotels = async () => {
    if (!selectedLocation?.code) {
      setError('Please select a location first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {
        cityCode: selectedLocation.code,
        checkInDate,
        checkOutDate,
        adults: numberOfAdults,
        roomQuantity: numberOfRooms
      };

      console.log('[HotelSearch] Searching hotels with params:', params);

      const response = await amadeusService.searchHotels(params);

      console.log('[HotelSearch] Hotel search response:', response);
      console.log('[HotelSearch] Response structure:', {
        hasData: !!response.data,
        dataLength: response.data?.length || 0,
        firstHotelName: response.data?.[0]?.hotel?.name || 'No hotels'
      });

      if (response && response.data) {
        console.log(`[HotelSearch] Found ${response.data.length} hotels`);

        const isMockData = response.data.some(hotel =>
          hotel.hotel.name.includes('Grand Hotel Downtown') ||
          hotel.hotel.name.includes('Park Avenue Suites') ||
          hotel.hotel.name.includes('Mock')
        );

        if (isMockData) {
          console.warn('[HotelSearch] WARNING: Response appears to contain mock data!');
        }

        setHotels(response.data);
      } else {
        console.error('[HotelSearch] Unexpected response format:', response);
        setError('No hotels found');
        setHotels([]);
      }
    } catch (error) {
      console.error('[HotelSearch] Error searching for hotels:', error);
      setError(`Failed to search for hotels: ${error.message}`);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const inspectHotelData = () => {
    console.log('[HotelSearch] Current hotels data:', hotels);

    if (hotels && hotels.length > 0) {
      const firstHotel = hotels[0];
      console.log('[HotelSearch] Detailed first hotel:', {
        name: firstHotel.hotel?.name,
        id: firstHotel.hotel?.hotelId,
        cityCode: firstHotel.hotel?.cityCode,
        isMockData: firstHotel.hotel?.name?.includes('Grand Hotel Downtown') ||
                   firstHotel.hotel?.name?.includes('Park Avenue Suites') || 
                   !firstHotel.hotel?.hotelId,
        hasOffers: !!firstHotel.offers,
        offerCount: firstHotel.offers?.length
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search for Hotels
      </Typography>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Search Results
        </Typography>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Searching for hotels...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-message">{error}</p>
            <p className="help-text">Try adjusting your search criteria or try a different location.</p>
          </div>
        ) : hotels.length > 0 ? (
          <Grid container spacing={3}>
            {hotels.map((hotelOffer) => {
              if (!hotelOffer.hotel?.hotelId) {
                console.error('Skipping hotel without hotelId:', hotelOffer.hotel?.name);
                return null;
              }

              return (
                <Grid item xs={12} sm={6} md={4} key={hotelOffer.hotel.hotelId}>
                  <HotelCard 
                    hotelOffer={hotelOffer} 
                    onSelect={(hotel) => console.log('Selected hotel:', hotel)} 
                  />
                </Grid>
              );
            }).filter(Boolean)}
          </Grid>
        ) : (
          <div className="no-results">
            <p>No hotels found for the selected criteria.</p>
            <p>Try adjusting your search or try a different location.</p>
          </div>
        )}

        {hotels.length > 0 && (
          <Button 
            variant="outlined" 
            color="info" 
            onClick={inspectHotelData}
            sx={{ mt: 2 }}
          >
            Debug Hotel Data
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default HotelSearch;