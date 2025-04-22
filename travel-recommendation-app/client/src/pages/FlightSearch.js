import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
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
import FlightIcon from '@mui/icons-material/Flight';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

// Placeholder function for API call
const searchFlights = async (params) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: 'flight1',
      airline: 'American Airlines',
      flightNumber: 'AA123',
      departureTime: '08:00',
      departureAirport: 'JFK',
      arrivalTime: '11:30',
      arrivalAirport: 'LAX',
      duration: '3h 30m',
      stops: 0,
      price: 299,
      currency: 'USD'
    },
    {
      id: 'flight2',
      airline: 'Delta',
      flightNumber: 'DL456',
      departureTime: '10:15',
      departureAirport: 'JFK',
      arrivalTime: '14:05',
      arrivalAirport: 'LAX',
      duration: '3h 50m',
      stops: 1,
      stopAirport: 'ORD',
      price: 249,
      currency: 'USD'
    },
    {
      id: 'flight3',
      airline: 'United',
      flightNumber: 'UA789',
      departureTime: '16:30',
      departureAirport: 'JFK',
      arrivalTime: '20:15',
      arrivalAirport: 'LAX',
      duration: '3h 45m',
      stops: 0,
      price: 329,
      currency: 'USD'
    }
  ];
};

const FlightSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    stops: 'any',
    airline: 'any',
    departureTime: 'any'
  });
  
  // Extract search parameters from URL
  const origin = queryParams.get('origin') || '';
  const destination = queryParams.get('destination') || '';
  const departureDate = queryParams.get('checkIn') || '';
  const returnDate = queryParams.get('checkOut') || '';
  const passengers = queryParams.get('guests') || 1;
  
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        const results = await searchFlights({
          origin,
          destination,
          departureDate,
          returnDate,
          passengers
        });
        setSearchResults(results);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('Failed to load flights. Please try again.');
        setLoading(false);
      }
    };
    
    fetchFlights();
  }, [origin, destination, departureDate, returnDate, passengers]);
  
  // Filter flights based on user preferences
  const filteredFlights = searchResults.filter(flight => {
    return (
      flight.price >= filters.minPrice &&
      flight.price <= filters.maxPrice &&
      (filters.stops === 'any' || 
        (filters.stops === 'nonstop' && flight.stops === 0) ||
        (filters.stops === 'oneStop' && flight.stops === 1)) &&
      (filters.airline === 'any' || flight.airline.includes(filters.airline))
    );
  });
  
  const handlePriceChange = (event, newValue) => {
    setFilters({
      ...filters,
      minPrice: newValue[0],
      maxPrice: newValue[1]
    });
  };
  
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Searching for flights from {origin} to {destination}...
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
          <FlightIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Flights
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box display="flex" alignItems="center">
              <Typography variant="h6">
                {origin}
              </Typography>
              <ArrowRightAltIcon sx={{ mx: 1 }} />
              <Typography variant="h6">
                {destination}
              </Typography>
            </Box>
            <Typography variant="body1">
              {departureDate} {returnDate ? `- ${returnDate}` : ''} · {passengers} {parseInt(passengers) === 1 ? 'passenger' : 'passengers'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search flights"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              placeholder="Airline, flight number..."
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
              Stops
            </Typography>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel>Stops</InputLabel>
              <Select
                name="stops"
                value={filters.stops}
                onChange={handleFilterChange}
                label="Stops"
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="nonstop">Nonstop only</MenuItem>
                <MenuItem value="oneStop">1 stop max</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="subtitle1" gutterBottom>
              Airline
            </Typography>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel>Airline</InputLabel>
              <Select
                name="airline"
                value={filters.airline}
                onChange={handleFilterChange}
                label="Airline"
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="American">American Airlines</MenuItem>
                <MenuItem value="Delta">Delta</MenuItem>
                <MenuItem value="United">United</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="subtitle1" gutterBottom>
              Departure Time
            </Typography>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Departure Time</InputLabel>
              <Select
                name="departureTime"
                value={filters.departureTime}
                onChange={handleFilterChange}
                label="Departure Time"
              >
                <MenuItem value="any">Any Time</MenuItem>
                <MenuItem value="morning">Morning (6AM - 12PM)</MenuItem>
                <MenuItem value="afternoon">Afternoon (12PM - 6PM)</MenuItem>
                <MenuItem value="evening">Evening (6PM - 12AM)</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              sx={{ mt: 3 }}
              onClick={() => setFilters({
                minPrice: 0,
                maxPrice: 1000,
                stops: 'any',
                airline: 'any',
                departureTime: 'any'
              })}
            >
              Reset Filters
            </Button>
          </Paper>
        </Grid>
        
        {/* Flight Results */}
        <Grid item xs={12} md={9}>
          {filteredFlights.length > 0 ? (
            <Grid container spacing={3}>
              {filteredFlights.map((flight) => (
                <Grid item xs={12} key={flight.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                        {/* Airline Info */}
                        <Box width={{ xs: '100%', sm: '20%' }} mb={{ xs: 2, sm: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {flight.airline}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Flight {flight.flightNumber}
                          </Typography>
                        </Box>
                        
                        {/* Flight Times */}
                        <Box width={{ xs: '100%', sm: '40%' }} mb={{ xs: 2, sm: 0 }}>
                          <Box display="flex" alignItems="center" justifyContent={{ xs: 'space-between', sm: 'center' }}>
                            <Box textAlign={{ xs: 'left', sm: 'center' }} mr={2}>
                              <Typography variant="h6">
                                {flight.departureTime}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {flight.departureAirport}
                              </Typography>
                            </Box>
                            
                            <Box display="flex" flexDirection="column" alignItems="center" sx={{ flex: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {flight.duration}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <Box sx={{ height: 1, bgcolor: 'divider', flex: 1 }} />
                                <FlightIcon color="primary" sx={{ mx: 1 }} />
                                <Box sx={{ height: 1, bgcolor: 'divider', flex: 1 }} />
                              </Box>
                              {flight.stops > 0 && (
                                <Chip 
                                  label={`${flight.stops} stop (${flight.stopAirport})`} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ mt: 0.5 }}
                                />
                              )}
                            </Box>
                            
                            <Box textAlign={{ xs: 'right', sm: 'center' }} ml={2}>
                              <Typography variant="h6">
                                {flight.arrivalTime}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {flight.arrivalAirport}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        {/* Price & Booking */}
                        <Box width={{ xs: '100%', sm: '25%' }} display="flex" flexDirection="column" alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                          <Typography variant="h5" color="primary" gutterBottom>
                            {flight.currency} {flight.price}
                          </Typography>
                          <Button variant="contained" color="primary" fullWidth>
                            Select Flight
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No flights found matching your criteria
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => setFilters({
                  minPrice: 0,
                  maxPrice: 1000,
                  stops: 'any',
                  airline: 'any',
                  departureTime: 'any'
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

export default FlightSearch;