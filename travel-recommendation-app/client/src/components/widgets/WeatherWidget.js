import React, { useState, useEffect } from 'react';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

const WeatherWidget = ({ location, locationName }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchWeather = async () => {
      // Guard against missing location data
      if (!location || !location.lat || !location.lng) {
        setLoading(false);
        setError('Location data not available');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // For demo, use mock data
        // In real app, you would use a weather API like:
        // const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location.lat},${location.lng}`);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock weather data
        const mockWeather = {
          temperature: 22,
          condition: 'Sunny',
          humidity: 65,
          windSpeed: 12
        };
        
        setWeather(mockWeather);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Could not load weather data');
        setLoading(false);
      }
    };
    
    fetchWeather();
  }, [location]);
  
  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <WbSunnyIcon fontSize="large" sx={{ color: '#FFD700' }} />;
      case 'cloudy':
      case 'partly cloudy':
        return <CloudIcon fontSize="large" sx={{ color: '#A9A9A9' }} />;
      case 'rain':
      case 'rainy':
        return <UmbrellaIcon fontSize="large" sx={{ color: '#4682B4' }} />;
      case 'snow':
      case 'snowy':
        return <AcUnitIcon fontSize="large" sx={{ color: '#B0E0E6' }} />;
      case 'thunderstorm':
        return <ThunderstormIcon fontSize="large" sx={{ color: '#4B0082' }} />;
      default:
        return <WbSunnyIcon fontSize="large" sx={{ color: '#FFD700' }} />;
    }
  };
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Current Weather in {locationName || 'this location'}
      </Typography>
      
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
          <CircularProgress size={40} />
        </Box>
      )}
      
      {error && (
        <Box textAlign="center" py={2}>
          <Typography color="error">
            {error}
          </Typography>
        </Box>
      )}
      
      {!loading && !error && weather && (
        <Box display="flex" alignItems="center">
          <Box mr={3}>
            {getWeatherIcon(weather.condition)}
          </Box>
          <Box>
            <Typography variant="h4">
              {weather.temperature}°C
            </Typography>
            <Typography variant="body1">
              {weather.condition}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Humidity: {weather.humidity}% | Wind: {weather.windSpeed} km/h
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default WeatherWidget;