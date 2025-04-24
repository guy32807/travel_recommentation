import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Rating,
  Chip,
  CircularProgress
} from '@mui/material';
import AttractionsIcon from '@mui/icons-material/Attractions';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import PublicIcon from '@mui/icons-material/Public';
import EventIcon from '@mui/icons-material/Event';
import FlightIcon from '@mui/icons-material/Flight'; // Add this import to fix the error
import WeatherWidget from '../components/widgets/WeatherWidget';
import CurrencyWidget from '../components/widgets/CurrencyWidget';

// Mock data for demonstration - in a real app, this would come from your API
const mockDestination = {
  id: "paris123",
  name: "Paris",
  country: "France",
  description: "Paris, the City of Light, is the capital of France and one of the most popular tourist destinations in the world. Known for its romantic ambiance, gastronomy, fashion, and art, Paris offers visitors a wealth of experiences from iconic landmarks to hidden gems.",
  mainImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80",
  images: [
    "https://images.unsplash.com/photo-1541171382475-0509176449e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1087&q=80",
    "https://images.unsplash.com/photo-1471623320832-752e8bbf8413?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  ],
  rating: 4.7,
  reviews: 3245,
  location: {
    coordinates: {
      latitude: 48.8566,
      longitude: 2.3522
    },
    address: "Paris, France"
  },
  attractions: [
    { name: "Eiffel Tower", description: "Iconic iron tower that's one of the most recognizable structures in the world", rating: 4.6 },
    { name: "Louvre Museum", description: "World's largest art museum and historic monument housing the Mona Lisa", rating: 4.8 },
    { name: "Notre-Dame Cathedral", description: "Medieval Catholic cathedral on the Île de la Cité", rating: 4.7 },
    { name: "Arc de Triomphe", description: "Iconic triumphal arch honoring those who fought for France", rating: 4.5 }
  ],
  restaurants: [
    { name: "Le Jules Verne", description: "Upscale restaurant on the Eiffel Tower with panoramic views", rating: 4.4 },
    { name: "L'Ambroisie", description: "Classic French cuisine in a refined setting", rating: 4.7 },
    { name: "Septime", description: "Modern French cuisine with a focus on seasonal ingredients", rating: 4.6 }
  ],
  hotels: [
    { name: "Hôtel Plaza Athénée", description: "Luxury hotel with views of the Eiffel Tower", rating: 4.8 },
    { name: "The Ritz Paris", description: "Historic luxury hotel in the heart of Paris", rating: 4.9 },
    { name: "Le Bristol Paris", description: "Elegant hotel with a rooftop swimming pool", rating: 4.7 }
  ],
  events: [
    { name: "Bastille Day", date: "July 14, 2024", description: "National celebration with fireworks at the Eiffel Tower" },
    { name: "Paris Fashion Week", date: "September 2024", description: "Major fashion event showcasing top designers" }
  ],
  bestTimeToVisit: "April to June and October to early November"
};

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDestination = async () => {
      try {
        setLoading(true);
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In real implementation, you would fetch data from your API
        // const response = await fetch(`/api/destinations/${id}`);
        // const data = await response.json();
        
        // For now, use mock data
        setDestination(mockDestination);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching destination:', err);
        setError('Failed to load destination details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchDestination();
  }, [id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" mt={2}>
          Loading destination details...
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
  
  // Safe guard against null or undefined destination
  if (!destination) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h6">
          Destination not found
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  // Now we can safely access destination properties
  const { name, country, description, mainImage, images, rating, reviews, location, attractions, restaurants, hotels, events, bestTimeToVisit } = destination;
  
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      {/* Destination Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {name}
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" component="span" sx={{ mr: 1 }}>
            {country}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <Rating value={rating} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({reviews} reviews)
            </Typography>
          </Box>
        </Box>
        <Typography variant="body1" paragraph>
          {description}
        </Typography>
      </Box>
      
      {/* Main Image */}
      <Paper 
        elevation={3} 
        sx={{ 
          height: 400, 
          mb: 4,
          backgroundImage: `url(${mainImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2 
        }}
      />
      
      {/* Image Gallery */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Gallery
        </Typography>
        <Grid container spacing={2}>
          {images && images.map((image, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={image}
                  alt={`${name} image ${index + 1}`}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      {/* Weather and Currency Widgets */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <WeatherWidget 
            location={location && location.coordinates ? {
              lat: location.coordinates.latitude,
              lng: location.coordinates.longitude
            } : null} 
            locationName={name} 
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CurrencyWidget country={country} />
        </Grid>
      </Grid>
      
      {/* Tabs for different information */}
      <Paper sx={{ mb: 4 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          aria-label="destination information tabs"
        >
          <Tab icon={<AttractionsIcon />} label="Attractions" />
          <Tab icon={<RestaurantIcon />} label="Restaurants" />
          <Tab icon={<HotelIcon />} label="Hotels" />
          <Tab icon={<EventIcon />} label="Events" />
          <Tab icon={<PublicIcon />} label="Travel Info" />
        </Tabs>
        
        <Divider />
        
        <Box sx={{ p: 3 }}>
          {/* Attractions Tab */}
          {tabValue === 0 && (
            <List>
              {attractions && attractions.map((attraction, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <AttractionsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">{attraction.name}</Typography>
                        <Rating value={attraction.rating} readOnly size="small" />
                      </Box>
                    }
                    secondary={attraction.description}
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          {/* Restaurants Tab */}
          {tabValue === 1 && (
            <List>
              {restaurants && restaurants.map((restaurant, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <RestaurantIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">{restaurant.name}</Typography>
                        <Rating value={restaurant.rating} readOnly size="small" />
                      </Box>
                    }
                    secondary={restaurant.description}
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          {/* Hotels Tab */}
          {tabValue === 2 && (
            <List>
              {hotels && hotels.map((hotel, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <HotelIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">{hotel.name}</Typography>
                        <Rating value={hotel.rating} readOnly size="small" />
                      </Box>
                    }
                    secondary={hotel.description}
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          {/* Events Tab */}
          {tabValue === 3 && (
            <List>
              {events && events.map((event, index) => (
                <ListItem key={index} alignItems="flex-start" sx={{ mb: 2 }}>
                  <ListItemIcon>
                    <EventIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="h6">{event.name}</Typography>
                        <Chip label={event.date} color="primary" variant="outlined" size="small" />
                      </Box>
                    }
                    secondary={event.description}
                  />
                </ListItem>
              ))}
            </List>
          )}
          
          {/* Travel Info Tab */}
          {tabValue === 4 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Best Time to Visit
              </Typography>
              <Typography paragraph>
                {bestTimeToVisit}
              </Typography>
              
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Typography paragraph>
                {location && location.address}
              </Typography>
              
              {/* Insert more travel information as needed */}
            </Box>
          )}
        </Box>
      </Paper>
      
      {/* Call to Action */}
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Ready to visit {name}?
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<HotelIcon />}
            onClick={() => {
              // Navigate to hotel search with this destination
              window.location.href = `/hotels/search?destination=${name}`;
            }}
          >
            Find Hotels
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<FlightIcon />}
            onClick={() => {
              // Navigate to flight search with this destination
              window.location.href = `/flights/search?destination=${name}`;
            }}
          >
            Find Flights
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DestinationDetail;