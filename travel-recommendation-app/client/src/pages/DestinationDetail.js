import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Divider, 
  Chip,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardMedia,
  CardContent,
  Rating,
  Tab,
  Tabs
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import WeatherIcon from '@mui/icons-material/Cloud';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HotelList from '../components/hotels/HotelList';
import travelApiService from '../services/travelApi';

const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelDialogOpen, setHotelDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const destinationData = await travelApiService.getDestinationById(id);
        setDestination(destinationData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load destination. Please try again later.');
        setLoading(false);
        console.error('Error fetching destination:', err);
      }
    };

    fetchDestination();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleHotelSelect = async (hotel) => {
    try {
      // Fetch more details about the hotel
      const hotelDetails = await travelApiService.getHotelDetails(hotel.place_id);
      setSelectedHotel(hotelDetails);
      setHotelDialogOpen(true);
    } catch (err) {
      console.error('Error fetching hotel details:', err);
    }
  };

  const handleDialogClose = () => {
    setHotelDialogOpen(false);
  };

  // Render budget indicator with icons
  const renderBudget = (level) => {
    const icons = [];
    let count;
    
    switch(level) {
      case 'budget':
        count = 1;
        break;
      case 'moderate':
        count = 2;
        break;
      case 'luxury':
        count = 3;
        break;
      default:
        count = 1;
    }
    
    for (let i = 0; i < count; i++) {
      icons.push(<AttachMoneyIcon key={i} />);
    }
    
    return icons;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={8}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !destination) {
    return (
      <Container maxWidth="md">
        <Box my={8} textAlign="center">
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Destination not found'}
          </Typography>
          <Button variant="contained" color="primary" href="/destinations">
            Back to Destinations
          </Button>
        </Box>
      </Container>
    );
  }

  const { 
    name, 
    location, 
    description, 
    images, 
    climate, 
    budgetLevel, 
    activities, 
    bestTimeToVisit,
    ratings,
    accommodations
  } = destination;

  // Format coordinates for hotel search
  const coordinates = location.coordinates 
    ? `${location.coordinates.latitude},${location.coordinates.longitude}` 
    : null;

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box 
        sx={{
          height: '50vh',
          background: `url(${images && images.length > 0 ? images[0] : 'https://source.unsplash.com/random/1200x800/?travel'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          mb: 4,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            color: 'white'
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom>
            {name}
          </Typography>
          <Box display="flex" alignItems="center">
            <LocationOnIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="h6">
              {location.city}, {location.country}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={4}>
        {/* Left Column: Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              About {name}
            </Typography>
            <Typography paragraph>
              {description}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Key Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <WeatherIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>Climate: {climate}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      <Typography mr={1}>Budget Level:</Typography> 
                      {renderBudget(budgetLevel)}
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
                    <Typography>
                      Best Time to Visit: {bestTimeToVisit ? bestTimeToVisit.join(', ') : 'All year'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography mr={1}>Rating:</Typography>
                    <Rating value={ratings?.average || 0} precision={0.5} readOnly />
                    <Typography variant="body2" color="text.secondary" ml={1}>
                      ({ratings?.count || 0} reviews)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Typography variant="h6" gutterBottom>
                Activities
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {activities && activities.map((activity, index) => (
                  <Chip 
                    key={index} 
                    label={activity} 
                    color="primary" 
                    variant="outlined" 
                  />
                ))}
              </Box>
            </Box>
          </Paper>

          {/* Tabs for Hotels, Flights, etc. */}
          <Paper elevation={2} sx={{ mb: 4 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              aria-label="destination options"
              variant="fullWidth"
            >
              <Tab label="Accommodations" />
              <Tab label="Gallery" />
              <Tab label="Reviews" />
            </Tabs>
            
            {/* Accommodations Tab */}
            {tabValue === 0 && (
              <Box p={3}>
                {coordinates ? (
                  <HotelList 
                    location={coordinates} 
                    onHotelSelect={handleHotelSelect}
                  />
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography color="textSecondary">
                      Coordinates not available for this destination.
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Gallery Tab */}
            {tabValue === 1 && (
              <Box p={3}>
                <Grid container spacing={2}>
                  {images && images.map((image, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <img 
                        src={image} 
                        alt={`${name} - ${index}`} 
                        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
            
            {/* Reviews Tab - Can be implemented later */}
            {tabValue === 2 && (
              <Box p={3} textAlign="center">
                <Typography>Reviews coming soon!</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Right Column: Map & Recommended Accommodations */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Map
            </Typography>
            {coordinates ? (
              <iframe
                title="Destination Map"
                width="100%"
                height="300"
                frameBorder="0"
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY_PUBLIC}&q=${coordinates}&zoom=12`}
                allowFullScreen
              ></iframe>
            ) : (
              <Box 
                height={300} 
                display="flex" 
                alignItems="center" 
                justifyContent="center"
                bgcolor="grey.100"
              >
                <Typography color="textSecondary">Map not available</Typography>
              </Box>
            )}
          </Paper>
          
          {/* Featured Accommodations */}
          {accommodations && accommodations.length > 0 && (
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recommended Stays
              </Typography>
              {accommodations.map((accommodation, index) => (
                <Card key={index} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" component="div">
                      {accommodation.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {accommodation.type} • {accommodation.priceRange}
                    </Typography>
                    {accommodation.link && (
                      <Button 
                        size="small" 
                        href={accommodation.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Book Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Paper>
          )}
        </Grid>
      </Grid>
      
      {/* Hotel Details Dialog */}
      <Dialog
        open={hotelDialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        {selectedHotel && (
          <>
            <DialogTitle>
              {selectedHotel.name}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Hotel Photos */}
                {selectedHotel.photos && selectedHotel.photos.length > 0 && (
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', overflowX: 'auto', gap: 1, pb: 1 }}>
                      {selectedHotel.photos.slice(0, 5).map((photo, index) => (
                        <img
                          key={index}
                          src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY_PUBLIC}`}
                          alt={`${selectedHotel.name} - ${index}`}
                          style={{ height: 200, borderRadius: 4 }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {/* Hotel Details */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Details
                  </Typography>
                  <Box mb={2}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Address:</strong> {selectedHotel.formatted_address}
                    </Typography>
                    {selectedHotel.formatted_phone_number && (
                      <Typography variant="body1" gutterBottom>
                        <strong>Phone:</strong> {selectedHotel.formatted_phone_number}
                      </Typography>
                    )}
                    {selectedHotel.rating && (
                      <Box display="flex" alignItems="center" mb={1}>
                        <Typography variant="body1" mr={1}>
                          <strong>Rating:</strong>
                        </Typography>
                        <Rating value={selectedHotel.rating} precision={0.1} readOnly />
                        <Typography variant="body2" color="text.secondary" ml={1}>
                          ({selectedHotel.user_ratings_total} reviews)
                        </Typography>
                      </Box>
                    )}
                    {selectedHotel.price_level && (
                      <Typography variant="body1" gutterBottom>
                        <strong>Price Level:</strong> {'$'.repeat(selectedHotel.price_level)}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                
                {/* Reviews */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Recent Reviews
                  </Typography>
                  {selectedHotel.reviews ? (
                    <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                      {selectedHotel.reviews.slice(0, 3).map((review, index) => (
                        <Box key={index} mb={2}>
                          <Box display="flex" alignItems="center" mb={0.5}>
                            <Typography variant="subtitle2" mr={1}>
                              {review.author_name}
                            </Typography>
                            <Rating value={review.rating} size="small" readOnly />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {review.text.length > 150 
                              ? `${review.text.substring(0, 150)}...` 
                              : review.text}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No reviews available.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              {selectedHotel.website && (
                <Button 
                  href={selectedHotel.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                >
                  Visit Website
                </Button>
              )}
              <Button onClick={handleDialogClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default DestinationDetail;