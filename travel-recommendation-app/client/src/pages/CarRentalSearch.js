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
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import LuggageIcon from '@mui/icons-material/Luggage';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ImportExportIcon from '@mui/icons-material/ImportExport';

// Placeholder function for API call
const searchCars = async (params) => {
  console.log('Searching cars with params:', params);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data
  return [
    {
      id: 'car1',
      name: 'Toyota Corolla',
      category: 'Economy',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      fuelEfficiency: '32 mpg',
      airConditioning: true,
      price: 45,
      priceTotal: 135,
      currency: 'USD',
      imageUrl: 'https://source.unsplash.com/random/300x200/?toyota,car',
      supplier: 'Hertz',
      features: ['Air Conditioning', 'Radio', 'Power Steering']
    },
    {
      id: 'car2',
      name: 'Ford Focus',
      category: 'Compact',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      fuelEfficiency: '30 mpg',
      airConditioning: true,
      price: 50,
      priceTotal: 150,
      currency: 'USD',
      imageUrl: 'https://source.unsplash.com/random/300x200/?ford,car',
      supplier: 'Avis',
      features: ['Air Conditioning', 'Bluetooth', 'Cruise Control']
    },
    {
      id: 'car3',
      name: 'Chevrolet Suburban',
      category: 'SUV',
      seats: 7,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      fuelEfficiency: '20 mpg',
      airConditioning: true,
      price: 85,
      priceTotal: 255,
      currency: 'USD',
      imageUrl: 'https://source.unsplash.com/random/300x200/?suv,car',
      supplier: 'Enterprise',
      features: ['Air Conditioning', 'Bluetooth', 'Navigation', '4WD']
    }
  ];
};

const CarRentalSearch = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('priceAsc');
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 500,
    carType: 'any',
    transmission: 'any',
    passengers: 'any'
  });
  
  // Extract search parameters from URL
  const destination = queryParams.get('destination') || '';
  const pickupDate = queryParams.get('checkIn') || '';
  const dropoffDate = queryParams.get('checkOut') || '';
  
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const results = await searchCars({
          destination,
          pickupDate,
          dropoffDate
        });
        setSearchResults(results);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load rental cars. Please try again.');
        setLoading(false);
      }
    };
    
    fetchCars();
  }, [destination, pickupDate, dropoffDate]);
  
  // Filter and sort cars
  const filteredCars = searchResults.filter(car => {
    return (
      car.price >= filters.minPrice &&
      car.price <= filters.maxPrice &&
      (filters.carType === 'any' || car.category === filters.carType) &&
      (filters.transmission === 'any' || car.transmission === filters.transmission) &&
      (filters.passengers === 'any' || car.seats >= parseInt(filters.passengers))
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'sizeAsc':
        const categories = ['Economy', 'Compact', 'Midsize', 'Standard', 'Full-size', 'SUV', 'Luxury'];
        return categories.indexOf(a.category) - categories.indexOf(b.category);
      case 'sizeDesc':
        const categoriesDesc = ['Economy', 'Compact', 'Midsize', 'Standard', 'Full-size', 'SUV', 'Luxury'];
        return categoriesDesc.indexOf(b.category) - categoriesDesc.indexOf(a.category);
      default:
        return a.price - b.price;
    }
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
          Finding rental cars in {destination}...
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
          <DirectionsCarIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Car Rentals in {destination}
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Typography variant="body1">
              {pickupDate} - {dropoffDate}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Search car models"
              variant="outlined"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              placeholder="Car model, supplier..."
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
              Price per Day
            </Typography>
            <Box sx={{ px: 1 }}>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={500}
                step={10}
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
              Car Type
            </Typography>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel>Car Type</InputLabel>
              <Select
                name="carType"
                value={filters.carType}
                onChange={handleFilterChange}
                label="Car Type"
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="Economy">Economy</MenuItem>
                <MenuItem value="Compact">Compact</MenuItem>
                <MenuItem value="Midsize">Midsize</MenuItem>
                <MenuItem value="SUV">SUV</MenuItem>
                <MenuItem value="Luxury">Luxury</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="subtitle1" gutterBottom>
              Transmission
            </Typography>
            <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
              <InputLabel>Transmission</InputLabel>
              <Select
                name="transmission"
                value={filters.transmission}
                onChange={handleFilterChange}
                label="Transmission"
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="Automatic">Automatic</MenuItem>
                <MenuItem value="Manual">Manual</MenuItem>
              </Select>
            </FormControl>
            
            <Typography variant="subtitle1" gutterBottom>
              Passengers
            </Typography>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Minimum Seats</InputLabel>
              <Select
                name="passengers"
                value={filters.passengers}
                onChange={handleFilterChange}
                label="Minimum Seats"
              >
                <MenuItem value="any">Any</MenuItem>
                <MenuItem value="2">2+</MenuItem>
                <MenuItem value="4">4+</MenuItem>
                <MenuItem value="5">5+</MenuItem>
                <MenuItem value="7">7+</MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              color="primary" 
              fullWidth 
              sx={{ mt: 3 }}
              onClick={() => setFilters({
                minPrice: 0,
                maxPrice: 500,
                carType: 'any',
                transmission: 'any',
                passengers: 'any'
              })}
            >
              Reset Filters
            </Button>
          </Paper>
        </Grid>
        
        {/* Car Results */}
        <Grid item xs={12} md={9}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="subtitle1">
              {filteredCars.length} cars available
            </Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
              >
                <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                <MenuItem value="sizeAsc">Size: Small to Large</MenuItem>
                <MenuItem value="sizeDesc">Size: Large to Small</MenuItem>
              </Select>
            </FormControl>
          </Box>
          
          {filteredCars.length > 0 ? (
            <Grid container spacing={3}>
              {filteredCars.map((car) => (
                <Grid item xs={12} key={car.id}>
                  <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                    <CardMedia
                      component="img"
                      sx={{ width: { xs: '100%', md: 200 }, height: { xs: 200, md: 'auto' } }}
                      image={car.imageUrl}
                      alt={car.name}
                    />
                    <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="h5" component="div">
                            {car.name}
                          </Typography>
                          <Chip 
                            label={car.category} 
                            color="primary" 
                            variant="outlined" 
                            size="small" 
                            sx={{ mt: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary" mt={1}>
                            Supplied by {car.supplier}
                          </Typography>
                        </Box>
                        <Box textAlign="right">
                          <Typography variant="h6" color="primary">
                            {car.currency} {car.price}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            per day
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Total: {car.currency} {car.priceTotal}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6} sm={3}>
                          <Box display="flex" alignItems="center">
                            <AirlineSeatReclineNormalIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {car.seats} seats
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box display="flex" alignItems="center">
                            <ImportExportIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {car.transmission}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box display="flex" alignItems="center">
                            <LocalGasStationIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {car.fuelType}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6} sm={3}>
                          <Box display="flex" alignItems="center">
                            <LuggageIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                            <Typography variant="body2">
                              {car.category === 'Economy' ? '1 large bag' : 
                               car.category === 'Compact' ? '2 large bags' : 
                               '3+ large bags'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Box mt={2}>
                        <Typography variant="body2" gutterBottom>
                          Features:
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={0.5}>
                          {car.features.map((feature, index) => (
                            <Chip key={index} label={feature} size="small" />
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
                No cars found matching your criteria
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                sx={{ mt: 2 }}
                onClick={() => setFilters({
                  minPrice: 0,
                  maxPrice: 500,
                  carType: 'any',
                  transmission: 'any',
                  passengers: 'any'
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

export default CarRentalSearch;