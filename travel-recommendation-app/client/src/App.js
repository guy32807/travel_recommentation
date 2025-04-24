import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import HotelSearch from './pages/HotelSearch';
import FlightSearch from './components/FlightSearch';
import CarRentalSearch from './components/CarRentalSearch';
import DestinationSearch from './components/destinations/DestinationSearch';
import BookingHotelSearch from './components/booking/BookingHotelSearch';
import BookingHotelDetail from './components/booking/BookingHotelDetail';

import './App.css';

// Create a responsive theme
let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: {
            xs: 8,
            sm: 16,
          },
          paddingRight: {
            xs: 8,
            sm: 16,
          },
        },
      },
    },
  },
});

// Make fonts responsive
theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS across browsers */}
      <Router>
        <Navbar />
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hotels" element={<HotelSearch />} />
            <Route path="/flights" element={<FlightSearch />} />
            <Route path="/cars" element={<CarRentalSearch />} />
            <Route path="/destinations" element={<DestinationSearch />} />
            <Route path="/booking/hotels" element={<BookingHotelSearch />} />
            <Route path="/booking/hotels/:hotelId" element={<BookingHotelDetail />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
