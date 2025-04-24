import React, { useState, useEffect } from 'react';
import { TextField, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material';
import amadeusService from '../services/amadeusService';

const LocationSearch = ({ onLocationSelect, label }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Clear locations when searchTerm is cleared
    if (!searchTerm) {
      setLocations([]);
      return;
    }

    // Don't search with less than 2 characters
    if (searchTerm.length < 2) {
      return;
    }

    const fetchLocations = async () => {
      try {
        setLoading(true);
        // Make sure we're calling the real API endpoint, not the mock one
        const response = await amadeusService.searchLocations(searchTerm);
        
        console.log('[LocationSearch] Location search response:', response);
        
        if (response && response.data) {
          setLocations(response.data);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error('[LocationSearch] Error searching locations:', error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchLocations();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectLocation = (location) => {
    if (onLocationSelect) {
      onLocationSelect(location);
    }
    setSearchTerm(location.name);
    setShowSuggestions(false);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        label={label || "Enter a city or airport"}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        fullWidth
        variant="outlined"
      />
      
      {showSuggestions && searchTerm.length >= 2 && (
        <Box sx={{ position: 'absolute', width: '100%', maxHeight: '300px', overflowY: 'auto', bgcolor: 'background.paper', zIndex: 1000, boxShadow: 3, mt: 0.5, borderRadius: 1 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : locations.length > 0 ? (
            <List>
              {locations.map((location) => (
                <ListItem 
                  key={location.id || location.code} 
                  onClick={() => handleSelectLocation(location)}
                  sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                >
                  <ListItemText 
                    primary={location.name} 
                    secondary={`${location.address?.cityName || ''} ${location.address?.countryName || location.countryName || ''}`} 
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              No locations found
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default LocationSearch;