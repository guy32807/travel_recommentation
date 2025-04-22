import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  CircularProgress,
  Chip,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import travelApiService from '../services/travelApi';

const DestinationsList = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    budget: '',
    climate: '',
    activity: ''
  });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true);
        
        // Build query parameters based on filters
        const queryParams = {};
        if (filters.budget) queryParams.budget = filters.budget;
        if (filters.climate) queryParams.climate = filters.climate;
        if (filters.activity) queryParams.activity = filters.activity;
        
        // Fetch destinations with filters
        let data;
        if (Object.keys(queryParams).length > 0) {
          data = await travelApiService.searchDestinations(queryParams);
        } else {
          data = await travelApiService.getDestinations();
        }
        
        setDestinations(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destinations:', err);
        setError('Failed to load destinations. Please try again later.');
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [filters]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      budget: '',
      climate: '',
      activity: ''
    });
  };

  // Helper to render budget level
  const renderBudget = (level) => {
    switch (level) {
      case 'budget':
        return <AttachMoneyIcon />;
      case 'moderate':
        return (<><AttachMoneyIcon /><AttachMoneyIcon /></>);
      case 'luxury':
        return (<><AttachMoneyIcon /><AttachMoneyIcon /><AttachMoneyIcon /></>);
      default:
        return <AttachMoneyIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={8}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Box my={8} textAlign="center">
          <Typography variant="h5" color="error" gutterBottom>
            {error}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Explore Destinations
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph>
          Discover amazing places around the world tailored to your preferences
        </Typography>
      </Box>

      {/* Filters */}
      <Paper elevation={2} sx={{ mb: 4, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filter Destinations
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="budget-label">Budget</InputLabel>
              <Select
                labelId="budget-label"
                name="budget"
                value={filters.budget}
                onChange={handleFilterChange}
                label="Budget"
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="budget">Budget</MenuItem>
                <MenuItem value="moderate">Moderate</MenuItem>
                <MenuItem value="luxury">Luxury</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="climate-label">Climate</InputLabel>
              <Select
                labelId="climate-label"
                name="climate"
                value={filters.climate}
                onChange={handleFilterChange}
                label="Climate"
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="tropical">Tropical</MenuItem>
                <MenuItem value="temperate">Temperate</MenuItem>
                <MenuItem value="arid">Arid</MenuItem>
                <MenuItem value="continental">Continental</MenuItem>
                <MenuItem value="polar">Polar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="activity-label">Activity</InputLabel>
              <Select
                labelId="activity-label"
                name="activity"
                value={filters.activity}
                onChange={handleFilterChange}
                label="Activity"
              >
                <MenuItem value="">Any</MenuItem>
                <MenuItem value="beach">Beach</MenuItem>
                <MenuItem value="hiking">Hiking</MenuItem>
                <MenuItem value="skiing">Skiing</MenuItem>
                <MenuItem value="sightseeing">Sightseeing</MenuItem>
                <MenuItem value="food">Food & Cuisine</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box mt={2} textAlign="right">
          <Button variant="outlined" color="primary" onClick={resetFilters}>
            Reset Filters
          </Button>
        </Box>
      </Paper>

      {/* Destinations Grid */}
      {destinations.length > 0 ? (
        <Grid container spacing={4}>
          {destinations.map((destination) => (
            <Grid item key={destination._id} xs={12} sm={6} md={4}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={destination.images && destination.images.length > 0 
                    ? destination.images[0] 
                    : 'https://source.unsplash.com/random/300x200/?travel'}
                  alt={destination.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {destination.name}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <LocationOnIcon fontSize="small" color="primary" sx={{ mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {destination.location.city}, {destination.location.country}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Typography variant="body2" color="text.secondary" mr={0.5}>
                        Budget:
                      </Typography>
                      {renderBudget(destination.budgetLevel)}
                    </Box>
                    
                    {destination.ratings && (
                      <Box display="flex" alignItems="center">
                        <Rating 
                          value={destination.ratings.average || 0} 
                          size="small" 
                          precision={0.5} 
                          readOnly 
                        />
                        <Typography variant="body2" color="text.secondary" ml={0.5}>
                          ({destination.ratings.count})
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {destination.description.substring(0, 120)}...
                  </Typography>
                  
                  <Box display="flex" flexWrap="wrap" gap={0.5} mb={1}>
                    {destination.activities && destination.activities.slice(0, 3).map((activity, index) => (
                      <Chip 
                        key={index} 
                        label={activity} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    ))}
                    {destination.activities && destination.activities.length > 3 && (
                      <Chip 
                        label={`+${destination.activities.length - 3} more`} 
                        size="small" 
                        variant="outlined" 
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    component={Link} 
                    to={`/destinations/${destination._id}`}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="small" 
                    color="primary" 
                    component={Link} 
                    to={`/book/${destination._id}`}
                  >
                    Book Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={6}>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            No destinations found matching your criteria
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={resetFilters}
            sx={{ mt: 2 }}
          >
            Clear Filters
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default DestinationsList;