import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, TextField, Button, Card, CardMedia, CardContent, Chip, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import amadeusService from '../services/amadeusService';

const DestinationSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [popularDestinations, setPopularDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load popular destinations on component mount
  useEffect(() => {
    const fetchPopularDestinations = async () => {
      try {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
          setPopularDestinations([
            { id: 1, name: 'Paris', country: 'France', image: 'https://picsum.photos/seed/paris/400/300', tags: ['Romantic', 'Culture'] },
            { id: 2, name: 'Tokyo', country: 'Japan', image: 'https://picsum.photos/seed/tokyo/400/300', tags: ['Adventure', 'Urban'] },
            { id: 3, name: 'New York', country: 'USA', image: 'https://picsum.photos/seed/newyork/400/300', tags: ['Urban', 'Shopping'] },
            { id: 4, name: 'Barcelona', country: 'Spain', image: 'https://picsum.photos/seed/barcelona/400/300', tags: ['Beach', 'Culture'] },
            { id: 5, name: 'Sydney', country: 'Australia', image: 'https://picsum.photos/seed/sydney/400/300', tags: ['Adventure', 'Beach'] },
            { id: 6, name: 'Bangkok', country: 'Thailand', image: 'https://picsum.photos/seed/bangkok/400/300', tags: ['Food', 'Budget'] },
          ]);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching popular destinations:', error);
        setError('Failed to load popular destinations');
        setLoading(false);
      }
    };

    fetchPopularDestinations();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm) return;

    setLoading(true);
    setError(null);

    try {
      // This would call your API service
      // const response = await amadeusService.getDestinationRecommendations({ keyword: searchTerm });
      
      // Simulate API call
      setTimeout(() => {
        const filteredDestinations = popularDestinations.filter(
          dest => dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 dest.country.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDestinations(filteredDestinations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error searching destinations:', error);
      setError(`Failed to search destinations: ${error.message}`);
      setDestinations([]);
      setLoading(false);
    }
  };

  const handleDestinationClick = (destination) => {
    console.log('Selected destination:', destination);
    // Navigate to destination details or add to trip
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Discover Destinations
      </Typography>
      
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={9}>
            <TextField
              fullWidth
              label="Search destinations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button 
              type="submit"
              variant="contained" 
              color="primary" 
              fullWidth
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Box sx={{ my: 2, p: 2, bgcolor: '#fff3f3', borderRadius: 1 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {searchTerm && destinations.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            Search Results
          </Typography>
          <Grid container spacing={3}>
            {destinations.map((destination) => (
              <Grid item xs={12} sm={6} md={4} key={destination.id}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => handleDestinationClick(destination)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={destination.image}
                    alt={destination.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {destination.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {destination.country}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {destination.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          sx={{ mr: 0.5, mb: 0.5 }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {searchTerm && destinations.length === 0 && !loading && (
        <Box sx={{ my: 4, textAlign: 'center' }}>
          <Typography>
            No destinations found matching "{searchTerm}". Try a different search term.
          </Typography>
        </Box>
      )}

      <Box>
        <Typography variant="h5" gutterBottom>
          Popular Destinations
        </Typography>
        
        {loading && !searchTerm ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {popularDestinations.map((destination) => (
              <Grid item xs={12} sm={6} md={4} key={destination.id}>
                <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={() => handleDestinationClick(destination)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={destination.image}
                    alt={destination.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {destination.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {destination.country}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {destination.tags.map((tag) => (
                        <Chip 
                          key={tag} 
                          label={tag} 
                          size="small" 
                          sx={{ mr: 0.5, mb: 0.5 }} 
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default DestinationSearch;