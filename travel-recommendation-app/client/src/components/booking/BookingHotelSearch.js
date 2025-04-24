import React, { useState } from 'react';
import { Container, Typography, Grid, Box, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, Slider, Chip, CircularProgress, Alert, Card, CardMedia, CardContent, CardActions, Rating, Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LocationSearch from '../LocationSearch';
import bookingService from '../../services/bookingService';
import { useNavigate } from 'react-router-dom';

const BookingHotelSearch = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  const [adults, setAdults] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [amenities, setAmenities] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const availableAmenities = [
    'Free WiFi', 'Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Room Service', 'Parking', 'Airport Shuttle'
  ];
  
  const handleSearch = async () => {
    if (!destination?.name) {
      setError('Please select a destination');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Format dates for API
      const checkIn = checkInDate.toISOString().split('T')[0];
      const checkOut = checkOutDate.toISOString().split('T')[0];
      
      const params = {
        destination: destination.name,
        checkIn,
        checkOut,
        adults,
        rooms,
        minRating,
        maxPrice: priceRange[1],
        amenities: amenities.join(',')
      };
      
      console.log('[BookingHotelSearch] Searching hotels with params:', params);
      
      const response = await bookingService.searchHotels(params);
      
      if (response && response.hotels) {
        console.log(`[BookingHotelSearch] Found ${response.hotels.length} hotels`);
        setHotels(response.hotels);
      } else {
        console.error('[BookingHotelSearch] Unexpected response format:', response);
        setError('No hotels found for your search criteria');
        setHotels([]);
      }
    } catch (error) {
      console.error('[BookingHotelSearch] Error searching for hotels:', error);
      setError(`Failed to search for hotels: ${error.message}`);
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAmenityToggle = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };
  
  const handleHotelSelect = (hotelId) => {
    navigate(`/booking/hotels/${hotelId}`);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Find Hotels with Booking.com
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <LocationSearch 
              onLocationSelect={setDestination} 
              label="Where are you going?"
            />
          </Grid>
          
          <Grid item xs={6} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Check-in"
                value={checkInDate}
                onChange={(newValue) => {
                  setCheckInDate(newValue);
                  // If check-out is before check-in, update it
                  if (newValue > checkOutDate) {
                    const newCheckOut = new Date(newValue);
                    newCheckOut.setDate(newValue.getDate() + 1);
                    setCheckOutDate(newCheckOut);
                  }
                }}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date()}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Check-out"
                value={checkOutDate}
                onChange={(newValue) => setCheckOutDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth />}
                minDate={new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)}
              />
            </LocalizationProvider>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Adults</InputLabel>
              <Select
                value={adults}
                label="Adults"
                onChange={(e) => setAdults(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <MenuItem key={num} value={num}>{num}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Rooms</InputLabel>
              <Select
                value={rooms}
                label="Rooms"
                onChange={(e) => setRooms(e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>{num}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>Price Range (USD)</Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={50}
              marks={[
                { value: 0, label: '$0' },
                { value: 250, label: '$250' },
                { value: 500, label: '$500' },
                { value: 750, label: '$750' },
                { value: 1000, label: '$1000' }
              ]}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>Minimum Rating</Typography>
            <Rating
              name="minimum-rating"
              value={minRating}
              onChange={(event, newValue) => {
                setMinRating(newValue);
              }}
              precision={1}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Typography gutterBottom>Amenities</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableAmenities.map((amenity) => (
                <Chip
                  key={amenity}
                  label={amenity}
                  onClick={() => handleAmenityToggle(amenity)}
                  color={amenities.includes(amenity) ? "primary" : "default"}
                  variant={amenities.includes(amenity) ? "filled" : "outlined"}
                />
              ))}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Hotels'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box>
        <Typography variant="h5" gutterBottom>
          Search Results
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : hotels.length > 0 ? (
          <Grid container spacing={3}>
            {hotels.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={hotel.images[0]}
                    alt={hotel.name}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {hotel.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={hotel.rating} precision={0.5} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({hotel.reviewCount} reviews)
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {hotel.address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hotel.distance}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        Amenities:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {hotel.amenities.slice(0, 3).map((amenity, index) => (
                          <Chip key={index} label={amenity} size="small" sx={{ mt: 0.5 }} />
                        ))}
                        {hotel.amenities.length > 3 && (
                          <Chip 
                            label={`+${hotel.amenities.length - 3} more`} 
                            size="small" 
                            variant="outlined" 
                            sx={{ mt: 0.5 }} 
                          />
                        )}
                      </Stack>
                    </Box>
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6" color="primary">
                        ${hotel.price.current}
                      </Typography>
                      {hotel.price.original > hotel.price.current && (
                        <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                          ${hotel.price.original}
                        </Typography>
                      )}
                      <Typography variant="caption" display="block">
                        per night
                      </Typography>
                    </Box>
                    <Button 
                      variant="contained" 
                      onClick={() => handleHotelSelect(hotel.id)}
                    >
                      View Details
                    </Button>
                  </Box>
                  {hotel.freeCancellation && (
                    <Box sx={{ bgcolor: '#e8f5e9', p: 1 }}>
                      <Typography variant="caption" color="success.main" sx={{ fontWeight: 'bold' }}>
                        Free cancellation
                      </Typography>
                    </Box>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          !loading && (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Typography>
                No hotels found for your search criteria. Try adjusting your filters.
              </Typography>
            </Box>
          )
        )}
      </Box>
    </Container>
  );
};

export default BookingHotelSearch;