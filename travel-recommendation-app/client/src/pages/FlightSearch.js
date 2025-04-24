import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import amadeusApiService from '../services/amadeusApi';

const FlightSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [flightDetailsOpen, setFlightDetailsOpen] = useState(false);
  const [priceConfirmation, setPriceConfirmation] = useState(null);
  const [confirmingPrice, setConfirmingPrice] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 2000,
    stops: 'any',
    airline: 'any',
    departureTime: 'any'
  });
  
  // Extract search parameters from URL
  const originLocationCode = queryParams.get('origin') || '';
  const destinationLocationCode = queryParams.get('destination') || '';
  const departureDate = queryParams.get('checkIn') || '';
  const returnDate = queryParams.get('checkOut') || '';
  const adults = queryParams.get('guests') || 1;
  
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Validate required parameters
        if (!originLocationCode || !destinationLocationCode || !departureDate) {
          setError('Please provide origin, destination, and departure date');
          setLoading(false);
          return;
        }
        
        const response = await amadeusApiService.searchFlights({
          originLocationCode,
          destinationLocationCode,
          departureDate,
          returnDate,
          adults,
          travelClass: 'ECONOMY'
        });
        
        if (response && response.data) {
          setSearchResults(response.data);
          
          // Set min/max price filter based on actual results
          const prices = response.data.map(offer => parseFloat(offer.price.total));
          if (prices.length) {
            const minPrice = Math.floor(Math.min(...prices));
            const maxPrice = Math.ceil(Math.max(...prices));
            setFilters(prev => ({
              ...prev,
              minPrice,
              maxPrice
            }));
          }
        } else {
          setSearchResults([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching flights:', err);
        setError('Failed to load flights. Please try again.');
        setLoading(false);
      }
    };
    
    fetchFlights();
  }, [originLocationCode, destinationLocationCode, departureDate, returnDate, adults]);
  
  // Filter flights based on user preferences
  const filteredFlights = searchResults.filter(flightOffer => {
    const price = parseFloat(flightOffer.price.total);
    const airline = flightOffer.validatingAirlineCodes[0];
    
    // Filter by price
    if (price < filters.minPrice || price > filters.maxPrice) {
      return false;
    }
    
    // Filter by stops (for the outbound segment)
    if (filters.stops !== 'any') {
      const outboundSegments = flightOffer.itineraries[0].segments.length;
      if (filters.stops === 'nonstop' && outboundSegments > 1) {
        return false;
      }
      if (filters.stops === 'oneStop' && outboundSegments > 2) {
        return false;
      }
    }
    
    // Filter by airline
    if (filters.airline !== 'any' && !flightOffer.validatingAirlineCodes.includes(filters.airline)) {
      return false;
    }
    
    // Filter by departure time
    if (filters.departureTime !== 'any') {
      const departureTime = flightOffer.itineraries[0].segments[0].departure.at;
      const departureHour = new Date(departureTime).getHours();
      
      if (filters.departureTime === 'morning' && (departureHour < 6 || departureHour >= 12)) {
        return false;
      }
      if (filters.departureTime === 'afternoon' && (departureHour < 12 || departureHour >= 18)) {
        return false;
      }
      if (filters.departureTime === 'evening' && (departureHour < 18 || departureHour >= 24)) {
        return false;
      }
    }
    
    return true;
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
  
  const handleFlightSelect = async (flight) => {
    setSelectedFlight(flight);
    setFlightDetailsOpen(true);
    
    try {
      setConfirmingPrice(true);
      const response = await amadeusApiService.confirmFlightPrice(flight);
      setPriceConfirmation(response.data);
      setConfirmingPrice(false);
    } catch (err) {
      console.error('Error confirming price:', err);
      setPriceConfirmation(null);
      setConfirmingPrice(false);
    }
  };
  
  const formatDuration = (duration) => {
    // Parse ISO 8601 duration format (e.g., PT2H30M)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    if (!match) return duration;
    
    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;
    
    return `${hours}h ${minutes}m`;
  };
  
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return {
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: date.toLocaleDateString([], { month: 'short', day: 'numeric', weekday: 'short' })
    };
  };
  
  const getStopsLabel = (segments) => {
    const numStops = segments.length - 1;
    if (numStops === 0) return 'Nonstop';
    return `${numStops} ${numStops === 1 ? 'stop' : 'stops'}`;
  };
  
  const getAirlineName = (code) => {
    // This would ideally be a lookup from a more complete airline database
    const airlines = {
      'AA': 'American Airlines',
      'UA': 'United Airlines',
      'DL': 'Delta Air Lines',
      'LH': 'Lufthansa',
      'BA': 'British Airways',
      'AF': 'Air France',
      'KL': 'KLM',
      'IB': 'Iberia',
      'EK': 'Emirates',
      'QR': 'Qatar Airways'
    };
    
    return airlines[code] || code;
  };
  
  const handleBookFlight = () => {
    // In a real application, this would navigate to a booking page or integrate with a booking system
    alert('Booking functionality would be implemented here');
    setFlightDetailsOpen(false);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Searching for flights from {originLocationCode} to {destinationLocationCode}...
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
            onClick={() => navigate('/')}
          >
            Return to Search
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
                {originLocationCode}
              </Typography>
              <ArrowRightAltIcon sx={{ mx: 1 }} />
              <Typography variant="h6">
                {destinationLocationCode}
              </Typography>
            </Box>
            <Typography variant="body1">
              {departureDate} {returnDate ? `- ${returnDate}` : ''} · {adults} {parseInt(adults) === 1 ? 'passenger' : 'passengers'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth
              onClick={() => navigate('/')}
              startIcon={<SearchIcon />}
            >
              Modify Search
            </Button>
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
                max={2000}
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
                {/* Dynamically generate airline options based on results */}
                {Array.from(new Set(searchResults.flatMap(offer => offer.validatingAirlineCodes))).map(code => (
                  <MenuItem key={code} value={code}>
                    {getAirlineName(code)}
                  </MenuItem>
                ))}
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
                maxPrice: 2000,
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
              {filteredFlights.map((flight, index) => {
                const outbound = flight.itineraries[0];
                const firstSegment = outbound.segments[0];
                const lastSegment = outbound.segments[outbound.segments.length - 1];
                
                const departureInfo = formatDateTime(firstSegment.departure.at);
                const arrivalInfo = formatDateTime(lastSegment.arrival.at);
                
                return (
                  <Grid item xs={12} key={`${flight.id}-${index}`}>
                    <Card>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
                          {/* Airline Info */}
                          <Box width={{ xs: '100%', sm: '20%' }} mb={{ xs: 2, sm: 0 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {getAirlineName(flight.validatingAirlineCodes[0])}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {firstSegment.carrierCode} {firstSegment.number}
                            </Typography>
                            <Chip 
                              label={getStopsLabel(outbound.segments)} 
                              color={outbound.segments.length === 1 ? "success" : "default"}
                              size="small"
                              sx={{ mt: 1 }}
                            />
                          </Box>
                          
                          {/* Flight Times */}
                          <Box width={{ xs: '100%', sm: '40%' }} mb={{ xs: 2, sm: 0 }}>
                            <Box display="flex" alignItems="center" justifyContent={{ xs: 'space-between', sm: 'center' }}>
                              <Box textAlign={{ xs: 'left', sm: 'center' }} mr={2}>
                                <Typography variant="h6">
                                  {departureInfo.time}
                                </Typography>
                                <Typography variant="body2">
                                  {departureInfo.date}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {firstSegment.departure.iataCode}
                                </Typography>
                              </Box>
                              
                              <Box display="flex" flexDirection="column" alignItems="center" sx={{ flex: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                  {formatDuration(outbound.duration)}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                  <Box sx={{ height: 1, bgcolor: 'divider', flex: 1 }} />
                                  <FlightIcon color="primary" sx={{ mx: 1 }} />
                                  <Box sx={{ height: 1, bgcolor: 'divider', flex: 1 }} />
                                </Box>
                                {outbound.segments.length > 1 && (
                                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                                    {outbound.segments.length - 1} stop
                                  </Typography>
                                )}
                              </Box>
                              
                              <Box textAlign={{ xs: 'right', sm: 'center' }} ml={2}>
                                <Typography variant="h6">
                                  {arrivalInfo.time}
                                </Typography>
                                <Typography variant="body2">
                                  {arrivalInfo.date}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {lastSegment.arrival.iataCode}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          {/* Price & Booking */}
                          <Box width={{ xs: '100%', sm: '25%' }} display="flex" flexDirection="column" alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                            <Typography variant="h5" color="primary" gutterBottom>
                              {flight.price.currency} {parseFloat(flight.price.total).toFixed(2)}
                            </Typography>
                            <Button 
                              variant="contained" 
                              color="primary" 
                              fullWidth
                              onClick={() => handleFlightSelect(flight)}
                            >
                              Select
                            </Button>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
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
                  maxPrice: 2000,
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
      
      {/* Flight Details Dialog */}
      <Dialog 
        open={flightDetailsOpen} 
        onClose={() => setFlightDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedFlight && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Flight Details
                </Typography>
                <Chip 
                  label={`${selectedFlight.price.currency} ${parseFloat(selectedFlight.price.total).toFixed(2)}`} 
                  color="primary" 
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              {confirmingPrice && (
                <Box textAlign="center" my={2}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Confirming price...
                  </Typography>
                </Box>
              )}
              
              {priceConfirmation?.flightOffers && !confirmingPrice && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Price confirmed: {priceConfirmation.flightOffers[0].price.currency} {parseFloat(priceConfirmation.flightOffers[0].price.total).toFixed(2)}
                </Alert>
              )}
              
              {/* Outbound Journey */}
              <Typography variant="h6" gutterBottom>
                Outbound Journey
              </Typography>
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="subtitle1">
                    {selectedFlight.itineraries[0].segments[0].departure.iataCode} to {selectedFlight.itineraries[0].segments[selectedFlight.itineraries[0].segments.length-1].arrival.iataCode}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDuration(selectedFlight.itineraries[0].duration)}
                  </Typography>
                </Box>
                
                {selectedFlight.itineraries[0].segments.map((segment, index) => {
                  const departure = formatDateTime(segment.departure.at);
                  const arrival = formatDateTime(segment.arrival.at);
                  
                  return (
                    <Box key={index} sx={{ mb: index < selectedFlight.itineraries[0].segments.length - 1 ? 2 : 0 }}>
                      <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                        <FlightTakeoffIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          {departure.time} · {departure.date} · {segment.departure.iataCode}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" sx={{ ml: 4, mb: 1 }}>
                        <Box sx={{ borderLeft: '1px dashed grey', mx: 1, my: 0 }} />
                        <Box>
                          <Typography variant="body2">
                            {getAirlineName(segment.carrierCode)} {segment.number}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Aircraft: {segment.aircraft?.code || 'Not specified'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Class: {segment.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'Economy'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box display="flex" alignItems="center">
                        <FlightLandIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body1">
                          {arrival.time} · {arrival.date} · {segment.arrival.iataCode}
                        </Typography>
                      </Box>
                      
                      {index < selectedFlight.itineraries[0].segments.length - 1 && (
                        <Box sx={{ ml: 4, my: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Connection time in {segment.arrival.iataCode}: 
                            {(() => {
                              const currentArrival = new Date(segment.arrival.at);
                              const nextDeparture = new Date(selectedFlight.itineraries[0].segments[index + 1].departure.at);
                              const diffMs = nextDeparture - currentArrival;
                              const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                              const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                              return ` ${diffHrs}h ${diffMins}m`;
                            })()}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Paper>
              
              {/* Return Journey - if it exists */}
              {selectedFlight.itineraries.length > 1 && (
                <>
                  <Typography variant="h6" gutterBottom>
                    Return Journey
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="subtitle1">
                        {selectedFlight.itineraries[1].segments[0].departure.iataCode} to {selectedFlight.itineraries[1].segments[selectedFlight.itineraries[1].segments.length-1].arrival.iataCode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatDuration(selectedFlight.itineraries[1].duration)}
                      </Typography>
                    </Box>
                    
                    {selectedFlight.itineraries[1].segments.map((segment, index) => {
                      const departure = formatDateTime(segment.departure.at);
                      const arrival = formatDateTime(segment.arrival.at);
                      
                      return (
                        <Box key={index} sx={{ mb: index < selectedFlight.itineraries[1].segments.length - 1 ? 2 : 0 }}>
                          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <FlightTakeoffIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body1">
                              {departure.time} · {departure.date} · {segment.departure.iataCode}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" sx={{ ml: 4, mb: 1 }}>
                            <Box sx={{ borderLeft: '1px dashed grey', mx: 1, my: 0 }} />
                            <Box>
                              <Typography variant="body2">
                                {getAirlineName(segment.carrierCode)} {segment.number}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Aircraft: {segment.aircraft?.code || 'Not specified'}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Class: {segment.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'Economy'}
                              </Typography>
                            </Box>
                          </Box>
                          
                          <Box display="flex" alignItems="center">
                            <FlightLandIcon color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body1">
                              {arrival.time} · {arrival.date} · {segment.arrival.iataCode}
                            </Typography>
                          </Box>
                          
                          {index < selectedFlight.itineraries[1].segments.length - 1 && (
                            <Box sx={{ ml: 4, my: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                Connection time in {segment.arrival.iataCode}: 
                                {(() => {
                                  const currentArrival = new Date(segment.arrival.at);
                                  const nextDeparture = new Date(selectedFlight.itineraries[1].segments[index + 1].departure.at);
                                  const diffMs = nextDeparture - currentArrival;
                                  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                                  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
                                  return ` ${diffHrs}h ${diffMins}m`;
                                })()}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Paper>
                </>
              )}
              
              {/* Price Breakdown */}
              <Typography variant="h6" gutterBottom>
                Price Breakdown
              </Typography>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      {adults} x Adult
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body1">
                      {selectedFlight.price.currency} {parseFloat(selectedFlight.price.base).toFixed(2)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={8}>
                    <Typography variant="body1">
                      Taxes and fees
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="body1">
                      {selectedFlight.price.currency} {(parseFloat(selectedFlight.price.total) - parseFloat(selectedFlight.price.base)).toFixed(2)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={8}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Total
                    </Typography>
                  </Grid>
                  <Grid item xs={4} textAlign="right">
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                      {selectedFlight.price.currency} {parseFloat(selectedFlight.price.total).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setFlightDetailsOpen(false)}>
                Close
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleBookFlight}
                disabled={confirmingPrice}
              >
                Book Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default FlightSearch;