import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import DestinationsList from './pages/DestinationsList';
import DestinationDetail from './pages/DestinationDetail';
import HotelSearch from './pages/HotelSearch';
import FlightSearch from './pages/FlightSearch';
import CarRentalSearch from './pages/CarRentalSearch';
import './App.css';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<DestinationsList />} />
          <Route path="/destinations/:id" element={<DestinationDetail />} />
          <Route path="/hotels/search" element={<HotelSearch />} />
          <Route path="/flights/search" element={<FlightSearch />} />
          <Route path="/cars/search" element={<CarRentalSearch />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
