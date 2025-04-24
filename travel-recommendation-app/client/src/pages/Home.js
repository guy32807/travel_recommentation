import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Find Your Perfect Trip
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover amazing destinations, find the best hotels, and plan your dream vacation.
        </Typography>
        <Button 
          component={Link} 
          to="/hotels" 
          variant="contained" 
          size="large" 
          color="primary" 
          sx={{ mt: 2 }}
        >
          Search Hotels
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="200"
              image="https://picsum.photos/seed/destination/800/500"
              alt="Destinations"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Popular Destinations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Explore the most popular travel destinations around the world, from vibrant cities to peaceful beaches.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="200"
              image="https://picsum.photos/seed/hotel/800/500"
              alt="Hotels"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Luxury Hotels
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Find the perfect accommodation for your trip, from budget-friendly options to luxury resorts.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardMedia
              component="img"
              height="200"
              image="https://picsum.photos/seed/activity/800/500"
              alt="Activities"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Amazing Activities
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Discover exciting activities and experiences that will make your trip unforgettable.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;