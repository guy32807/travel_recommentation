import React, { useState } from 'react';
import { Container, Typography, Grid, Box, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import LocationSearch from './LocationSearch';

const CarRentalSearch = () => {
  const [pickupLocation, setPickupLocation] = useState(null);
  const [returnLocation, setReturnLocation] = useState(null);
  const [sameReturnLocation, setSameReturnLocation] = useState(true);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState('10:00');
  const [returnDate, setReturnDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [returnTime, setReturnTime] = useState('10:00');
  const [driverAge, setDriverAge] = useState(30);
  const [carType, setCarType] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!pickupLocation) {
      setError('Please select a pickup location');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // This would typically call an API service
      console.log('Searching car rentals with:', {
        pickupLocation: pickupLocation.name,
        returnLocation: sameReturnLocation ? pickupLocation.name : returnLocation?.name,
        pickupDate: pickupDate.toISOString().split('T')[0],
        pickupTime,
        returnDate: returnDate.toISOString().split('T')[0],
        returnTime,
        driverAge,
        carType
      });
      
      // Simulate API call
      setTimeout(() => {
        setResults([
          { id: 1, name: 'Economy Car', price: 35, company: 'Hertz', rating: 4.2 },
          { id: 2, name: 'Compact SUV', price: 55, company: 'Avis', rating: 4.0 },
          { id: 3, name: 'Midsize Sedan', price: 45, company: 'Enterprise', rating: 4.5 },
        ]);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error searching for car rentals:', error);
      setError(`Failed to search for car rentals: ${error.message}`);
      setResults([]);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Rent a Car
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={sameReturnLocation ? 6 : 4}>
              <LocationSearch 
                onLocationSelect={setPickupLocation} 
                label="Pickup Location"
              />
            </Grid>
            
            {!sameReturnLocation && (
              <Grid item xs={12} md={4}>
                <LocationSearch 
                  onLocationSelect={setReturnLocation} 
                  label="Return Location"
                />
              </Grid>
            )}
            
            <Grid item xs={12} md={sameReturnLocation ? 6 : 4}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={sameReturnLocation} 
                    onChange={(e) => setSameReturnLocation(e.target.checked)} 
                  />
                }
                label="Return to same location"
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Pickup Date"
                  value={pickupDate}
                  onChange={(newValue) => setPickupDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <TextField
                label="Pickup Time"
                type="time"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Return Date"
                  value={returnDate}
                  onChange={(newValue) => setReturnDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <TextField
                label="Return Time"
                type="time"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <TextField
                label="Driver's Age"
                type="number"
                value={driverAge}
                onChange={(e) => setDriverAge(e.target.value)}
                fullWidth
                InputProps={{ inputProps: { min: 18, max: 99 } }}
              />
            </Grid>
            
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Car Type</InputLabel>
                <Select
                  value={carType}
                  label="Car Type"
                  onChange={(e) => setCarType(e.target.value)}
                >
                  <MenuItem value="ALL">All Car Types</MenuItem>
                  <MenuItem value="ECONOMY">Economy</MenuItem>
                  <MenuItem value="COMPACT">Compact</MenuItem>
                  <MenuItem value="MIDSIZE">Midsize</MenuItem>
                  <MenuItem value="FULLSIZE">Full Size</MenuItem>
                  <MenuItem value="SUV">SUV</MenuItem>
                  <MenuItem value="LUXURY">Luxury</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                disabled={loading}
              >
                {loading ? 'Searching...' : 'Search Car Rentals'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* Car rental results section */}
      <Box>
        <Typography variant="h5" gutterBottom>
          Available Cars
        </Typography>
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <Typography>Searching for car rentals...</Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ my: 2, p: 2, bgcolor: '#fff3f3', borderRadius: 1 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        
        {!loading && !error && results.length === 0 && (
          <Box sx={{ my: 4, textAlign: 'center' }}>
            <Typography>
              No car rentals found. Try adjusting your search criteria.
            </Typography>
          </Box>
        )}
        
        {results.length > 0 && (
          <Grid container spacing={3}>
            {results.map((car) => (
              <Grid item xs={12} md={4} key={car.id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6">{car.name}</Typography>
                  <Typography variant="body1">Company: {car.company}</Typography>
                  <Typography variant="body1">Price: ${car.price}/day</Typography>
                  <Typography variant="body2">Rating: {car.rating}/5</Typography>
                  <Button variant="contained" sx={{ mt: 2 }}>Select</Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default CarRentalSearch;