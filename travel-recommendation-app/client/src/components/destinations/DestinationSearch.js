import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import DestinationCard from './DestinationCard';
import amadeusService from '../../services/amadeusService';

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
        setError(null);
        
        // Use default parameters to get popular destinations
        const params = {
          originCityCode: 'NYC', // Default origin
          destinationTypes: 'CITY', // Focus on cities
          maxPrice: 2000, // Reasonable budget
        };
        
        console.log('[DestinationSearch] Fetching popular destinations...');
        const response = await amadeusService.getDestinationRecommendations(params);
        
        if (response && response.data) {
          console.log(`[DestinationSearch] Received ${response.data.length} destinations`);
          
          // Map API response to our destination format
          const formattedDestinations = response.data.map(dest => ({
            id: dest.destinationId || dest.subType + '-' + dest.name,
            name: dest.name,
            country: dest.country || 'Unknown',
            description: `Popular destination with ${dest.analytics?.travelers?.score || 'many'} travelers.`,
            image: `https://picsum.photos/seed/${dest.name.replace(/\s+/g, '').toLowerCase()}/400/300`,
            cost: getPriceCategory(dest.price?.total),
            climate: getClimateFromSeason(),
            price: dest.price?.total,
            coordinates: {
              latitude: dest.geoCode?.latitude,
              longitude: dest.geoCode?.longitude
            }
          }));
          
          setPopularDestinations(formattedDestinations);
        } else {
          console.error('[DestinationSearch] Invalid response format:', response);
          setError('Failed to load destinations: Invalid response from API');
          
          // Fallback to some default destinations
          setPopularDestinations([
            {
              id: 1,
              name: 'Paris',
              country: 'France',
              description: 'The City of Light, famous for its architecture and culture.',
              image: 'https://picsum.photos/seed/paris/400/300',
              cost: 'High',
              climate: 'Moderate',
            },
            {
              id: 2,
              name: 'Tokyo',
              country: 'Japan',
              description: 'A metropolis blending ultramodern and traditional aspects.',
              image: 'https://picsum.photos/seed/tokyo/400/300',
              cost: 'High',
              climate: 'Seasonal',
            }
          ]);
        }
      } catch (err) {
        console.error('[DestinationSearch] Error fetching popular destinations:', err);
        setError(`Failed to load destinations: ${err.message}`);
        
        // Fallback to empty state
        setPopularDestinations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularDestinations();
  }, []);

  // Helper to categorize price
  const getPriceCategory = (price) => {
    if (!price) return 'Unknown';
    if (price < 500) return 'Budget';
    if (price < 1500) return 'Medium';
    return 'High';
  };

  // Helper to get climate based on current season (simplistic approach)
  const getClimateFromSeason = () => {
    const month = new Date().getMonth();
    // Northern hemisphere seasons (very simplified)
    if (month >= 2 && month <= 4) return 'Spring';
    if (month >= 5 && month <= 7) return 'Summer';
    if (month >= 8 && month <= 10) return 'Autumn';
    return 'Winter';
  };

  // Search for destinations based on user input
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`[DestinationSearch] Searching for destinations with keyword: ${searchTerm}`);
      
      // Use the search term to find destinations
      const params = {
        keyword: searchTerm,
        destinationTypes: 'CITY,COUNTRY',
      };
      
      const response = await amadeusService.getDestinationRecommendations(params);
      
      if (response && response.data) {
        console.log(`[DestinationSearch] Found ${response.data.length} matching destinations`);
        
        // Map API response to our destination format
        const formattedDestinations = response.data.map(dest => ({
          id: dest.destinationId || dest.subType + '-' + dest.name,
          name: dest.name,
          country: dest.country || 'Unknown',
          description: dest.description || `Popular destination with excellent attractions.`,
          image: `https://picsum.photos/seed/${dest.name.replace(/\s+/g, '').toLowerCase()}/400/300`,
          cost: getPriceCategory(dest.price?.total),
          climate: getClimateFromSeason(),
          price: dest.price?.total,
          coordinates: {
            latitude: dest.geoCode?.latitude,
            longitude: dest.geoCode?.longitude
          }
        }));
        
        setDestinations(formattedDestinations);
      } else {
        console.error('[DestinationSearch] Invalid search response:', response);
        setError('No destinations found matching your search');
        setDestinations([]);
      }
    } catch (err) {
      console.error('[DestinationSearch] Error searching destinations:', err);
      setError(`Search failed: ${err.message}`);
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press in search field
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Explore Destinations
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          label="Search destinations"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          variant="outlined"
          placeholder="Type a city or country name"
        />
        <Button 
          variant="contained" 
          color="primary"
          onClick={handleSearch}
          disabled={loading || !searchTerm.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Search results section */}
      {destinations.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
            Search Results
          </Typography>
          <Grid container spacing={3}>
            {destinations.map(destination => (
              <Grid item xs={12} sm={6} md={4} key={destination.id}>
                <DestinationCard destination={destination} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      {/* No results message */}
      {searchTerm && !loading && destinations.length === 0 && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography variant="h6">
            No destinations found matching "{searchTerm}"
          </Typography>
          <Button 
            variant="outlined" 
            color="primary"
            onClick={() => setSearchTerm('')}
            sx={{ mt: 2 }}
          >
            Clear Search
          </Button>
        </Box>
      )}
      
      {/* Popular destinations section */}
      <Typography variant="h5" sx={{ mb: 2, mt: 6 }}>
        Popular Destinations
      </Typography>
      
      {!loading && popularDestinations.length > 0 && (
        <Grid container spacing={3}>
          {popularDestinations.map(destination => (
            <Grid item xs={12} sm={6} md={4} key={destination.id}>
              <DestinationCard destination={destination} />
            </Grid>
          ))}
        </Grid>
      )}
      
      {!loading && popularDestinations.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Typography>
            No popular destinations available right now. Try searching for a specific destination.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default DestinationSearch;