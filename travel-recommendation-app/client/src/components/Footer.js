import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We help travelers find the best hotels, flights, and car rentals for their next adventure.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Services
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/hotels" color="inherit" display="block">Hotels</Link>
              <Link href="/flights" color="inherit" display="block">Flights</Link>
              <Link href="/cars" color="inherit" display="block">Car Rentals</Link>
              <Link href="/destinations" color="inherit" display="block">Destinations</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Link href="/terms" color="inherit" display="block">Terms of Service</Link>
              <Link href="/privacy" color="inherit" display="block">Privacy Policy</Link>
              <Link href="/cookies" color="inherit" display="block">Cookie Policy</Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@travelapp.com<br />
              Phone: +1 (123) 456-7890<br />
              Address: 123 Travel St, New York, NY
            </Typography>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Travel Recommendation App. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;