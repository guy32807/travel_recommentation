// Update the HotelCard component to avoid using mock data sources
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Rating, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const HotelCard = ({ hotelOffer, onSelect }) => {
  // Check if we have valid data
  if (!hotelOffer || !hotelOffer.hotel) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error">Invalid hotel data</Alert>
        </CardContent>
      </Card>
    );
  }

  const hotel = hotelOffer.hotel;
  const offer = hotelOffer.offers && hotelOffer.offers.length > 0 ? hotelOffer.offers[0] : null;
  
  // Check for hotel ID (real Amadeus data always has this)
  if (!hotel.hotelId) {
    console.error('Hotel data missing hotelId - likely mock data:', hotel);
    return (
      <Card>
        <CardContent>
          <Alert severity="warning">
            Unable to display this hotel - incomplete data
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  // Safe rating parser
  const getRatingValue = () => {
    if (!hotel.rating) return 0;
    const parsed = parseInt(hotel.rating);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  // Get a proper image - ONLY use actual hotel images or a generic placeholder
  const getImageUrl = () => {
    // If hotel has media with actual images
    if (hotel.media && hotel.media.length > 0 && hotel.media[0].uri) {
      return hotel.media[0].uri;
    }
    
    // Use a consistent but random image based on hotel ID
    // Using Lorem Picsum instead of Unsplash (which might be associated with mock data)
    return `https://picsum.photos/seed/${hotel.hotelId}/300/200`;
  };
  
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="200"
        image={getImageUrl()}
        alt={hotel.name}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom variant="h5" component="div">
          {hotel.name}
        </Typography>
        
        {/* Hotel rating */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating 
            name={`hotel-rating-${hotel.hotelId}`} 
            value={getRatingValue()} 
            readOnly 
            precision={0.5}
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {hotel.rating ? `${hotel.rating}/5` : 'Not rated'}
          </Typography>
        </Box>
        
        {/* Location */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {hotel.address?.cityName || ''} 
          {hotel.address?.countryCode ? `, ${hotel.address.countryCode}` : ''}
        </Typography>
        
        {/* Room description */}
        {offer && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            {offer.roomDescription || 'Standard Room'}
          </Typography>
        )}
        
        {/* Price information */}
        {offer && offer.price && (
          <Typography variant="h6" color="primary" sx={{ mt: 'auto', pt: 1 }}>
            {offer.price.currency} {offer.price.total}
            <Typography variant="caption" sx={{ ml: 1 }}>
              {offer.price.variations?.average?.base ? 'per night' : 'total'}
            </Typography>
          </Typography>
        )}
        
        {/* Action button */}
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => onSelect(hotelOffer)}
        >
          View Details
        </Button>
      </CardContent>
    </StyledCard>
  );
};

export default HotelCard;