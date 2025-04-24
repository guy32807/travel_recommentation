import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Container, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HotelIcon from '@mui/icons-material/Hotel';
import FlightIcon from '@mui/icons-material/Flight';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import ExploreIcon from '@mui/icons-material/Explore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  
  // Determine active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes('/hotels')) return 0;
    if (path.includes('/flights')) return 1;
    if (path.includes('/cars')) return 2;
    if (path.includes('/destinations')) return 3;
    return false;
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const navItems = [
    { label: 'Hotels', icon: <HotelIcon />, path: '/hotels' },
    { label: 'Flights', icon: <FlightIcon />, path: '/flights' },
    { label: 'Car Rentals', icon: <DriveEtaIcon />, path: '/cars' },
    { label: 'Destinations', icon: <ExploreIcon />, path: '/destinations' }
  ];
  
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Travel App
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.label}
            selected={location.pathname === item.path}
          >
            <Box sx={{ mr: 1 }}>{item.icon}</Box>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Travel Recommendation App
          </Typography>

          {isMobile ? (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <>
              <Box sx={{ flexGrow: 1, display: 'flex', ml: 4 }}>
                <Tabs 
                  value={getActiveTab()} 
                  textColor="inherit" 
                  indicatorColor="secondary"
                >
                  {navItems.map((item) => (
                    <Tab 
                      key={item.label} 
                      icon={item.icon} 
                      label={item.label} 
                      component={Link} 
                      to={item.path} 
                      iconPosition="start"
                    />
                  ))}
                </Tabs>
              </Box>
              <Box>
                <IconButton color="inherit" aria-label="account" component={Link} to="/account">
                  <AccountCircleIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;