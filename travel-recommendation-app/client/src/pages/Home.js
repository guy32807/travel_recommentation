import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

const HeroSection = styled('div')(({ theme }) => ({
  padding: theme.spacing(8, 0, 6),
  backgroundImage: 'url(https://source.unsplash.com/random/1600x900/?travel)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  }
}));

const HeroContent = styled('div')(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  padding: theme.spacing(6),
}));

const SearchContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(-6),
  position: 'relative',
  zIndex: 2,
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
}));

const SearchButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0),
}));

const Home = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState('');
  const [climate, setClimate] = useState('');
  const [activity, setActivity] = useState('');

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (budget) queryParams.append('budget', budget);
    if (climate) queryParams.append('climate', climate);
    if (activity) queryParams.append('activity', activity);

    navigate(`/destinations/search?${queryParams.toString()}`);
  };

  return (
    <>
      <HeroSection>
        <Container maxWidth="md">
          <HeroContent>
            <Typography component="h1" variant="h2" align="center" gutterBottom>
              Discover Your Perfect Destination
            </Typography>
            <Typography variant="h5" align="center" paragraph>
              Find the best travel destinations based on your preferences and budget. 
              From tropical beaches to snowy mountains, we have recommendations for every traveler.
            </Typography>
          </HeroContent>
        </Container>
      </HeroSection>

      <Container maxWidth="md">
        <SearchContainer elevation={3}>
          <Typography variant="h4" gutterBottom align="center">
            Find Your Ideal Destination
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <StyledFormControl fullWidth>
                <InputLabel id="budget-label">Budget</InputLabel>
                <Select
                  labelId="budget-label"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <MenuItem value=""><em>Any</em></MenuItem>
                  <MenuItem value="budget">Budget</MenuItem>
                  <MenuItem value="moderate">Moderate</MenuItem>
                  <MenuItem value="luxury">Luxury</MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledFormControl fullWidth>
                <InputLabel id="climate-label">Climate</InputLabel>
                <Select
                  labelId="climate-label"
                  value={climate}
                  onChange={(e) => setClimate(e.target.value)}
                >
                  <MenuItem value=""><em>Any</em></MenuItem>
                  <MenuItem value="tropical">Tropical</MenuItem>
                  <MenuItem value="temperate">Temperate</MenuItem>
                  <MenuItem value="arid">Arid</MenuItem>
                  <MenuItem value="continental">Continental</MenuItem>
                  <MenuItem value="polar">Polar</MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <StyledFormControl fullWidth>
                <InputLabel id="activity-label">Activity</InputLabel>
                <Select
                  labelId="activity-label"
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                >
                  <MenuItem value=""><em>Any</em></MenuItem>
                  <MenuItem value="beach">Beach</MenuItem>
                  <MenuItem value="hiking">Hiking</MenuItem>
                  <MenuItem value="skiing">Skiing</MenuItem>
                  <MenuItem value="sightseeing">Sightseeing</MenuItem>
                  <MenuItem value="food">Food & Cuisine</MenuItem>
                </Select>
              </StyledFormControl>
            </Grid>
          </Grid>
          <SearchButton 
            fullWidth 
            variant="contained" 
            color="primary"
            onClick={handleSearch}
          >
            Search Destinations
          </SearchButton>
        </SearchContainer>
      </Container>
    </>
  );
};

export default Home;