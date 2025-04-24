import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Box, 
  Rating, 
  CircularProgress,
  Button
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import HotelIcon from '@mui/icons-material/Hotel';
import travelApiService from '../../services/travelApi';

const HotelList = ({ location, onHotelSelect }) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        // location should be in format "latitude,longitude"
        const hotelsData = await travelApiService.searchHotels(location);
        setHotels(hotelsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load hotels. Please try again later.');
        setLoading(false);
        console.error('Error fetching hotels:', err);
      }
    };

    if (location) {
      fetchHotels();
    }
  }, [location]);

  const handleHotelClick = (hotel) => {
    if (onHotelSelect) {
      onHotelSelect(hotel);
    }
  };

  // Update the getPhotoUrl function to avoid using placeholder images
  const getPhotoUrl = (photoReference) => {
    if (!photoReference) {
      // Use a generic hotel image that's clearly NOT mock data
      return 'https://picsum.photos/seed/hotel/300/200';
    }
    
    // If we have a photo reference, use the Google Places API
    if (process.env.REACT_APP_GOOGLE_PLACES_API_KEY_PUBLIC) {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY_PUBLIC}`;
    }
    
    // Fallback if no API key is available
    return 'https://picsum.photos/seed/hotel/300/200';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4} textAlign="center">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!hotels.length) {
    return (
      <Box my={4} textAlign="center">
        <Typography>No hotels found in this area. Try expanding your search.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h2" gutterBottom>
        Nearby Accommodations
      </Typography>
      
      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel.place_id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={getPhotoUrl(hotel.photos?.[0]?.photo_reference)}
                alt={hotel.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {hotel.name}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating value={hotel.rating || 0} precision={0.1} readOnly />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    ({hotel.user_ratings_total || 0})
                  </Typography>
                </Box>
                
                <Box display="flex" alignItems="flex-start" mb={1}>
                  <LocationOnIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {hotel.vicinity}
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" mt={2}>
                  <Button 
                    variant="outlined" 
                    startIcon={<HotelIcon />}
                    onClick={() => handleHotelClick(hotel)}
                  >
                    View Details
                  </Button>
                  
                  {hotel.website && (
                    <Button 
                      variant="text" 
                      endIcon={<OpenInNewIcon />}
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default HotelList;