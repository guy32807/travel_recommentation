import React, { useState } from 'react';
import { Container, Typography, Grid, Box, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LocationSearch from './LocationSearch';
import amadeusService from '../services/amadeusService';

const FlightSearch = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [adults, setAdults] = useState(1);
  const [travelClass, setTravelClass] = useState('ECONOMY');
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!origin || !destination) {
      setError('Please select origin and destination');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format dates for API
      const formattedDepartureDate = departureDate.toISOString().split('T')[0];
      const formattedReturnDate = returnDate.toISOString().split('T')[0];

      const params = {
        originLocationCode: origin.code,
        destinationLocationCode: destination.code,
        departureDate: formattedDepartureDate,
        adults,
        travelClass,
      };

      if (isRoundTrip) {
        params.returnDate = formattedReturnDate;
      }

      console.log('Searching flights with params:', params);

      const response = await amadeusService.searchFlights(params);
      
      if (response && response.data) {
        console.log(`Found ${response.data.length} flights`);
        setFlights(response.data);
      } else {
        setFlights([]);
        setError('No flights found for your search criteria');
      }
    } catch (error) {
      console.error('Error searching for flights:', error);
      setError(`Failed to search for flights: ${error.message}`);
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Find Flights
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={5}>
              <LocationSearch 
                onLocationSelect={setOrigin} 
                label="From (City or Airport)"
              />
            </Grid>
            
            <Grid item xs={12} md={5}>
              <LocationSearch 
                onLocationSelect={setDestination} 
                label="To (City or Airport)"
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Departure Date"
                  value={departureDate}
                  onChange={(newValue) => setDepartureDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Return Date"
                  value={returnDate}
                  onChange={(newValue) => setReturnDate(newValue)}
                  disabled={!isRoundTrip}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Passengers</InputLabel>
                <Select
                  value={adults}
                  label="Passengers"
                  onChange={(e) => setAdults(e.target.value)}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <MenuItem key={num} value={num}>{num}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Class</InputLabel>
                <Select
                  value={travelClass}
                  label="Class"
                  onChange={(e) => setTravelClass(e.target.value)}
                >
                  <MenuItem value="ECONOMY">Economy</MenuItem>
                  <MenuItem value="PREMIUM_ECONOMY">Premium Economy</MenuItem>
                  <MenuItem value="BUSINESS">Business</MenuItem>
                  <MenuItem value="FIRST">First</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ height: '100%' }}
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Flights'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Flight results section */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Flight Results
        </Typography>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Typography>Searching for flights...</Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ my: 2, p: 2, bgcolor: '#fff3f3', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        
        {!loading && !error && flights.length === 0 && (
          <Box sx={{ my: 4, textAlign: 'center' }}>
            <Typography>
              No flights found. Try adjusting your search criteria.
            </Typography>
          </Box>
        )}
        
        {flights.length > 0 && (
          <Box sx={{ my: 2 }}>
            <Typography variant="body1">
              Displaying {flights.length} flight options.
            </Typography>
            
            {/* Here you would normally display flight cards */}
            <Typography variant="body2" color="text.secondary">
              Flight data available. Implement flight cards to display results.
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FlightSearch;