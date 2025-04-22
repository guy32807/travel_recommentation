import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Rating,
  Chip,
  Button,
  Paper,
  CircularProgress,
  Divider,
  TextField,
  InputAdornment,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';

// Placeholder function for API call
const searchHotels = async (params) => {
  // In a real app, this would call your API service
  console.log('Searching hotels with params:', params);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: 'hotel1',
      name: 'Grand Hotel',
      location: 'Downtown, New York',
      rating: 4.5,
      reviewCount: 324,
      price: 199,
      currency: 'USD',
      imageUrl: 'https://source.unsplash.com/random/300x200/?hotel',
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant']
    },
    {
      id: 'hotel2',
      name: 'City View Hotel',
      location: 'Midtown, New York',
      rating: 4.2,
      reviewCount: 186,
      price: 149,
      currency: 'USD',
      imageUrl: 'https://source.unsplash.com/random/300x200/?hotel,room',
      amenities: ['Free WiFi', 'Gym', 'Restaurant']
    },
    {
      id: 'hotel3',
      name: 'Harbor Suites',
      location: 'Battery Park, New York',
      rating: 4.7,
      reviewCount: 208,
      price: 259,
      currency: 'USD',
      imageUrl: 'https://source.unsplash.com/random/300x200/?hotel,luxury',
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Gym']
    }
  ];
};

const HotelSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    amenities: []
  });
  
  // Extract search parameters from URL
  const destination = queryParams.get('destination') || '';
  const checkIn = queryParams.get('checkIn') || '';
  const checkOut = queryParams.get('checkOut') || '';
  const guests = queryParams.get('guests') || 2;
  
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const results = await searchHotels({
          destination,
          checkIn,
          checkOut,
          guests
        });
        setSearchResults(results);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hotels:', err);
        setError('Failed to load hotels. Please try again.');
        setLoading(false);
      }
    };
    
    fetchHotels();
  }, [destination, checkIn, checkOut, guests]);
  
  // Filter hotels based on user preferences
  const filteredHotels = searchResults.filter(hotel => {
    return (
      hotel.price >= filters.minPrice &&
      hotel.price <= filters.maxPrice &&
      hotel.rating >= filters.rating
    );
  });
  
  const handlePriceChange = (event, newValue) => {
    setFilters({
      ...filters,
      minPrice: newValue[0],
      maxPrice: newValue[1]
    });
  };
  
  const handleRatingChange = (event) => {
    setFilters({
      ...filters,
      rating: event.target.value
    });
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Finding the best hotels in {destination}...
        </Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
          <Button 
            variant="outlined" 
            color="primary" 
            sx={{ mt: 2 }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Search Summary */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Hotels in {destination}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="body1">
              {checkIn && checkOut ? `${checkIn} - ${checkOut}` : 'Select dates'} · {guests} {parseInt(guests) === 1 ? 'guest' : 'guests'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search hotels"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              placeholder="Hotel name, amenities..."
            />
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Filters Panel */}
        <Grid item xs={12} md={3}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Price Range
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
                step={50}
              />
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2">
                  ${filters.minPrice}
                </Typography>
                <Typography variant="body2">
                  ${filters.maxPrice}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Star Rating
            </Typography>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Minimum Rating</InputLabel>
              <Select
                value={filters.rating}
                onChange={handleRatingChange}
                label="Minimum Rating"
              >
                <MenuItem value={0}>Any</MenuItem>
                <MenuItem value={3}>3+ Stars</MenuItem>
                <MenuItem value={4}>4+ Stars</MenuItem>
                <MenuItem value={4.5}>4.5+ Stars</MenuItem>
              </Select>
            </FormControl>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="subtitle1" gutterBottom>
              Popular Filters
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
              <Chip label="Free WiFi" variant="outlined" onClick={() => {}} />
              <Chip label="Pool" variant="outlined" onClick={() => {}} />
              <Chip label="Free Breakfast" variant="outlined" onClick={() => {}} />
              <Chip label="Spa" variant="outlined" onClick={() => {}} />
              <Chip label="Pet Friendly" variant="outlined" onClick={() => {}} />
            </Box>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              sx={{ mt: 3 }}
              onClick={() => setFilters({
                minPrice: 0,
                maxPrice: 1000,
                rating: 0,
                amenities: []
              })}
            >
              Reset Filters
            </Button>
          </Paper>
        </Grid>
        
        {/* Hotel Results */}
        <Grid item xs={12} md={9}>
          {filteredHotels.length > 0 ? (
            <Grid container spacing={3}>
              {filteredHotels.map((hotel) => (
                <Grid item xs={12} key={hotel.id}>
                  <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                    <CardMedia
                      component="img"
                      sx={{ width: { xs: '100%', md: 200 }, height: { xs: 200, md: 'auto' } }}
                      image={hotel.imageUrl}
                      alt={hotel.name}
                    />
                    <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h5" component="div">
                            {hotel.name}
                          </Typography>
                          <Box display="flex" alignItems="center" mt={1}>
                            <LocationOnIcon fontSize="small" color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              {hotel.location}
                            </Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="h6" color="primary">
                            {hotel.currency} {hotel.price}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            per night
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mt={2}>
                        <Rating value={hotel.rating} precision={0.5} readOnly />
                        <Typography variant="body2" color="text.secondary" ml={1}>
                          ({hotel.reviewCount} reviews)
                        </Typography>
                      </Box>
                      
                      <Box mt={2}>
                        <Typography variant="body2" gutterBottom>
                          Amenities:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {hotel.amenities.map((amenity, index) => (
                            <Chip key={index} label={amenity} size="small" />
                          ))}
                        </Box>
                      </Box>
                      
                      <Box mt="auto" display="flex" justifyContent="flex-end" pt={2}>
                        <Button variant="outlined" sx={{ mr: 1 }}>
                          View Details
                        </Button>
                        <Button variant="contained" color="primary">
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No hotels found matching your criteria
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => setFilters({
                  minPrice: 0,
                  maxPrice: 1000,
                  rating: 0,
                  amenities: []
                })}
              >
                Reset Filters
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default HotelSearch;