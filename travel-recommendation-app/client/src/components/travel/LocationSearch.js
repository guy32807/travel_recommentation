import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Autocomplete, 
  CircularProgress,
  Box,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightIcon from '@mui/icons-material/Flight';
import amadeusService from '../../services/amadeusService';

const LocationSearch = ({ label, placeholder, initialValue, onChange, startAdornment, fullWidth }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  
  useEffect(() => {
    let active = true;
    
    if (inputValue.length < 2) {
      setOptions([]);
      return undefined;
    }
    
    const fetchLocations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Searching for locations with keyword:', inputValue);
        
        // Use the Amadeus service to fetch location data
        const response = await amadeusService.searchLocations(inputValue);
        
        console.log('Location search response:', response);
        
        if (active && response && response.data) {
          setOptions(response.data);
          console.log('Set options with data:', response.data);
        } else {
          setOptions([]);
          console.log('No data returned from API');
        }
      } catch (error) {
        console.error('Error searching locations:', error);
        
        // More detailed error message for debugging
        console.error('Error details:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          data: error.response?.data
        });
        
        const errorMessage = 
          error.message || 
          error.response?.data?.message ||
          'Failed to fetch locations. Please try again.';
        
        setError(errorMessage);
        setShowError(true);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce the API call
    const debounceTimer = setTimeout(() => {
      fetchLocations();
    }, 500);
    
    return () => {
      active = false;
      clearTimeout(debounceTimer);
    };
  }, [inputValue]);
  
  // For handling initialValue correctly
  const getOptionSelected = (option, value) => {
    if (!option || !value) return false;
    
    if (typeof value === 'string') {
      return option.iataCode === value;
    }
    
    return option.iataCode === value.iataCode;
  };
  
  // Close error snackbar
  const handleErrorClose = () => {
    setShowError(false);
  };
  
  return (
    <>
      <Autocomplete
        id={`location-search-${label}`}
        options={options}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return `${option.name} (${option.iataCode})`;
        }}
        isOptionEqualToValue={getOptionSelected}
        filterOptions={(x) => x} // We're handling filtering server-side
        autoComplete
        includeInputInList
        filterSelectedOptions
        loading={loading}
        loadingText="Searching..."
        noOptionsText={inputValue.length >= 2 
          ? (loading ? "Searching..." : "No locations found") 
          : "Type at least 2 characters"}
        value={initialValue}
        onChange={(event, newValue) => {
          if (onChange) {
            onChange(newValue);
          }
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder || "Search for city or airport"}
            fullWidth={fullWidth !== false}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {startAdornment}
                  {params.InputProps.startAdornment}
                </>
              ),
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <Box display="flex" alignItems="center">
              {option.subType === 'AIRPORT' ? (
                <FlightIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              ) : (
                <LocationOnIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
              )}
              <Box>
                <Typography variant="body1">
                  {option.name} ({option.iataCode})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {option.address?.cityName}{option.address?.countryName ? `, ${option.address.countryName}` : ''}
                </Typography>
              </Box>
            </Box>
          </li>
        )}
      />
      
      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleErrorClose} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LocationSearch;