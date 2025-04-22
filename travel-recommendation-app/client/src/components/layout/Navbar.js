import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  TextField,
  Paper,
  Grid,
  IconButton,
  Drawer,
  useMediaQuery,
  createTheme,
  ThemeProvider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

// Create theme instance - this is what was missing
const theme = createTheme();

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    origin: ''
  });
  const [searchType, setSearchType] = useState('hotels'); // 'hotels', 'flights', 'cars'
  
  // Theme provider is needed for useMediaQuery to work correctly
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleSearchParamChange = (param, value) => {
    setSearchParams(prev => ({
      ...prev,
      [param]: value
    }));
  };
  
  const handleSearch = () => {
    const { destination, checkIn, checkOut, guests, origin } = searchParams;
    
    // Validate required fields based on search type
    if (!destination) {
      alert('Please enter a destination');
      return;
    }
    
    if (searchType === 'flights' && !origin) {
      alert('Please enter an origin for flights');
      return;
    }
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('destination', destination);
    params.append('checkIn', checkIn);
    params.append('checkOut', checkOut);
    params.append('guests', guests);
    
    if (searchType === 'hotels') {
      navigate(`/hotels/search?${params.toString()}`);
    } else if (searchType === 'flights') {
      params.append('origin', origin);
      navigate(`/flights/search?${params.toString()}`);
    } else if (searchType === 'cars') {
      navigate(`/cars/search?${params.toString()}`);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="default" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {isSmallScreen ? (
              <>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                  Travel Recommendations
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                  Travel Recommendations
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button color="inherit" component={Link} to="/">
                    Home
                  </Button>
                  <Button color="inherit" component={Link} to="/destinations">
                    Destinations
                  </Button>
                  <Button color="inherit" component={Link} to="/about">
                    About
                  </Button>
                </Box>
              </>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      
      {/* Search Bar */}
      <Paper elevation={2} sx={{ py: 2, px: 3, mb: 2 }}>
        <Container maxWidth="xl">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={12}>
              <Box display="flex" mb={2} justifyContent="center">
                <Button 
                  variant={searchType === 'hotels' ? "contained" : "outlined"}
                  color="primary"
                  startIcon={<HotelIcon />}
                  onClick={() => setSearchType('hotels')}
                  sx={{ mx: 1 }}
                >
                  Hotels
                </Button>
                <Button 
                  variant={searchType === 'flights' ? "contained" : "outlined"}
                  color="primary"
                  startIcon={<FlightIcon />}
                  onClick={() => setSearchType('flights')}
                  sx={{ mx: 1 }}
                >
                  Flights
                </Button>
                <Button 
                  variant={searchType === 'cars' ? "contained" : "outlined"}
                  color="primary"
                  startIcon={<DirectionsCarIcon />}
                  onClick={() => setSearchType('cars')}
                  sx={{ mx: 1 }}
                >
                  Cars
                </Button>
              </Box>
            </Grid>
            
            {/* Destination */}
            <Grid item xs={12} md={searchType === 'flights' ? 3 : 4}>
              <TextField
                label="Where are you going?"
                variant="outlined"
                fullWidth
                value={searchParams.destination}
                onChange={(e) => handleSearchParamChange('destination', e.target.value)}
                InputProps={{
                  startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            
            {/* Origin (only for flights) */}
            {searchType === 'flights' && (
              <Grid item xs={12} md={3}>
                <TextField
                  label="Where are you flying from?"
                  variant="outlined"
                  fullWidth
                  value={searchParams.origin}
                  onChange={(e) => handleSearchParamChange('origin', e.target.value)}
                  InputProps={{
                    startAdornment: <FlightIcon color="action" sx={{ mr: 1 }} />
                  }}
                />
              </Grid>
            )}
            
            {/* Check-in Date */}
            <Grid item xs={6} md={searchType === 'flights' ? 2 : 3}>
              <TextField
                label={searchType === 'flights' ? "Departure Date" : "Check-in Date"}
                type="date"
                variant="outlined"
                fullWidth
                value={searchParams.checkIn}
                onChange={(e) => handleSearchParamChange('checkIn', e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            
            {/* Check-out Date */}
            <Grid item xs={6} md={searchType === 'flights' ? 2 : 3}>
              <TextField
                label={searchType === 'flights' ? "Return Date" : "Check-out Date"}
                type="date"
                variant="outlined"
                fullWidth
                value={searchParams.checkOut}
                onChange={(e) => handleSearchParamChange('checkOut', e.target.value)}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
            
            {/* Guests */}
            <Grid item xs={12} md={2}>
              <TextField
                label={searchType === 'flights' ? "Passengers" : "Guests"}
                type="number"
                variant="outlined"
                fullWidth
                value={searchParams.guests}
                onChange={(e) => handleSearchParamChange('guests', e.target.value)}
                InputProps={{
                  inputProps: { min: 1 }
                }}
              />
            </Grid>
            
            {/* Search Button */}
            <Grid item xs={12} md={2}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSearch}
                startIcon={<SearchIcon />}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Paper>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
          <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: 'primary.main' }}>
            Travel App
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column' }}>
            <Button component={Link} to="/" sx={{ mb: 1 }}>Home</Button>
            <Button component={Link} to="/destinations" sx={{ mb: 1 }}>Destinations</Button>
            <Button component={Link} to="/about" sx={{ mb: 1 }}>About</Button>
          </Box>
        </Box>
      </Drawer>
    </ThemeProvider>
  );
};

export default Navbar;