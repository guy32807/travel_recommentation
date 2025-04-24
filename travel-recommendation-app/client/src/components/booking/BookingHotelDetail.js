import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Box, Paper, Button, 
  Divider, Chip, Rating, Card, CardContent, Tab, Tabs, 
  List, ListItem, ListItemIcon, ListItemText, CircularProgress, 
  Alert, ImageList, ImageListItem, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow
} from '@mui/material';
import { 
  CheckCircleOutline, Pool, Wifi, Spa, FitnessCenter, 
  Restaurant, RoomService, LocalParking, AirportShuttle,
  LocationOn, AccessTime, Pets, ChildFriendly
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import bookingService from '../../services/bookingService';

// Map amenity names to icons
const amenityIcons = {
  'Free WiFi': <Wifi />,
  'Pool': <Pool />,
  'Spa': <Spa />,
  'Fitness Center': <FitnessCenter />,
  'Restaurant': <Restaurant />,
  'Room Service': <RoomService />,
  'Parking': <LocalParking />,
  'Airport Shuttle': <AirportShuttle />
};

const BookingHotelDetail = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch hotel details
        const hotelResponse = await bookingService.getHotelDetails(hotelId);
        
        if (hotelResponse && hotelResponse.hotel) {
          setHotel(hotelResponse.hotel);
          
          // Fetch reviews
          const reviewsResponse = await bookingService.getHotelReviews(hotelId, { limit: 5 });
          
          if (reviewsResponse && reviewsResponse.reviews) {
            setReviews(reviewsResponse.reviews);
          }
        } else {
          setError('Hotel not found');
        }
      } catch (error) {
        console.error('[BookingHotelDetail] Error fetching hotel details:', error);
        setError(`Failed to load hotel details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHotelDetails();
  }, [hotelId]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleBookNow = () => {
    // In a real app, this would navigate to a booking page
    alert(`Booking for ${hotel.name} will be processed. This is a demo.`);
  };
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading hotel details...</Typography>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }
  
  if (!hotel) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Hotel not found
        </Alert>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button variant="outlined" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back to Search Results
      </Button>
      
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {hotel.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={hotel.rating} precision={0.5} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({hotel.reviewCount} reviews)
              </Typography>
              {Array.from({ length: hotel.starRating }).map((_, index) => (
                <span key={index} style={{ color: '#FFD700', marginLeft: '4px' }}>★</span>
              ))}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOn color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {hotel.address.street}, {hotel.address.city}, {hotel.address.postalCode}, {hotel.address.country}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Card variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  From ${hotel.roomTypes[0].price} per night
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large"
                  onClick={handleBookNow}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
            
            {hotel.policies.freeCancellation && (
              <Box sx={{ bgcolor: '#e8f5e9', p: 2, borderRadius: 1 }}>
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                  Free cancellation available
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <ImageList variant="quilted" cols={4} gap={8}>
          {hotel.images.map((item, index) => (
            <ImageListItem key={index} cols={index === 0 ? 2 : 1} rows={index === 0 ? 2 : 1}>
              <img
                src={item}
                alt={`Hotel view ${index + 1}`}
                loading="lazy"
                style={{ borderRadius: '4px' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="Overview" />
          <Tab label="Rooms" />
          <Tab label="Amenities" />
          <Tab label="Reviews" />
          <Tab label="Location" />
          <Tab label="Policies" />
        </Tabs>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Overview Tab */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              About {hotel.name}
            </Typography>
            <Typography variant="body1" paragraph>
              {hotel.description}
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Main Amenities
                </Typography>
                <List dense>
                  {hotel.amenities.slice(0, 6).map((amenity, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {amenityIcons[amenity] || <CheckCircleOutline />}
                      </ListItemIcon>
                      <ListItemText primary={amenity} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Nearby Attractions
                </Typography>
                <List dense>
                  {hotel.nearbyAttractions.map((attraction, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <LocationOn />
                      </ListItemIcon>
                      <ListItemText 
                        primary={attraction.name} 
                        secondary={`${attraction.distance} away`} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Rooms Tab */}
        {activeTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Available Room Types
            </Typography>
            
            <Grid container spacing={3}>
              {hotel.roomTypes.map((room, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <Typography variant="h6" gutterBottom>
                            {room.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 1 }}>
                            {room.beds} • {room.size}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                            <Chip 
                              size="small" 
                              label={hotel.policies.freeCancellation ? "Free cancellation" : "Non-refundable"} 
                              color={hotel.policies.freeCancellation ? "success" : "default"} 
                              variant="outlined" 
                            />
                            {Math.random() > 0.5 && <Chip size="small" label="Breakfast included" variant="outlined" />}
                            {Math.random() > 0.5 && <Chip size="small" label="Pay at property" variant="outlined" />}
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <Typography variant="h6" color="primary" gutterBottom>
                            ${room.price}
                          </Typography>
                          <Typography variant="caption" display="block" gutterBottom>
                            per night
                          </Typography>
                          <Button 
                            variant="contained" 
                            color="primary"
                            onClick={handleBookNow}
                            sx={{ mt: 'auto' }}
                          >
                            Select
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Amenities Tab */}
        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Property Amenities
            </Typography>
            
            <Grid container spacing={2}>
              {hotel.amenities.map((amenity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ mr: 2 }}>
                          {amenityIcons[amenity] || <CheckCircleOutline />}
                        </Box>
                        <Typography>{amenity}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
        
        {/* Reviews Tab */}
        {activeTab === 3 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Guest Reviews
              </Typography>
              <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
                <Rating value={hotel.rating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Based on {hotel.reviewCount} reviews
                </Typography>
              </Box>
            </Box>
            
            {reviews.map((review, index) => (
              <Paper 
                key={index} 
                elevation={1} 
                sx={{ p: 2, mb: 2, bgcolor: index % 2 === 0 ? 'background.default' : 'background.paper' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {review.title}
                  </Typography>
                  <Rating value={review.rating} size="small" readOnly />
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {review.text}
                </Typography>
                
                {(review.pros || review.cons) && (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {review.pros && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                          + Liked: {review.pros}
                        </Typography>
                      </Grid>
                    )}
                    
                    {review.cons && (
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="error.main" sx={{ fontWeight: 'bold' }}>
                          - Disliked: {review.cons}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {review.reviewer.name} from {review.reviewer.country}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Stayed {review.stayDuration} in {review.room} • {review.date}
                  </Typography>
                </Box>
                
                {index < reviews.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Paper>
            ))}
            
            <Button variant="outlined" sx={{ mt: 2 }}>
              See All Reviews
            </Button>
          </Box>
        )}
        
        {/* Location Tab */}
        {activeTab === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Location & Surroundings
            </Typography>
            
            <Box sx={{ position: 'relative', height: '400px', mb: 3 }}>
              {/* In a real app, you would use a map component here */}
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  bgcolor: '#e0e0e0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: 1
                }}
              >
                <Typography>
                  Interactive map would be displayed here with location at {hotel.coordinates.latitude}, {hotel.coordinates.longitude}
                </Typography>
              </Box>
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Nearby Attractions
            </Typography>
            
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Distance</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hotel.nearbyAttractions.map((attraction, index) => (
                    <TableRow key={index}>
                      <TableCell>{attraction.name}</TableCell>
                      <TableCell>{attraction.distance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
        
        {/* Policies Tab */}
        {activeTab === 5 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Hotel Policies
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Check-in / Check-out
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Check-in time" 
                        secondary={`From ${hotel.policies.checkIn}`} 
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTime />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Check-out time" 
                        secondary={`Until ${hotel.policies.checkOut}`} 
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Cancellation
                  </Typography>
                  <Typography variant="body2">
                    {hotel.policies.cancellationPolicy}
                  </Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Children
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChildFriendly sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {hotel.policies.childrenPolicy}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Pets
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Pets sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {hotel.policies.petPolicy}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BookingHotelDetail;