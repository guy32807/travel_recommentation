import React from 'react';
// Update imports to use MUI v5
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AcUnitIcon from '@mui/icons-material/AcUnit';

// Use styled API from MUI v5
const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 345,
  margin: theme.spacing(2),
}));

const IconWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const DestinationCard = ({ destination }) => {
  // If no destination is provided, use default data
  const defaultDestination = {
    name: 'Paris',
    country: 'France',
    description: 'The City of Light, famous for its stunning architecture, art museums, and romantic atmosphere.',
    image: 'https://picsum.photos/seed/paris/400/300',
    cost: 'High',
    climate: 'Moderate',
  };

  const dest = destination || defaultDestination;

  return (
    <StyledCard>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={dest.image}
          alt={dest.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {dest.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dest.description}
          </Typography>
          <IconWrapper>
            <LocationOnIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {dest.country}
            </Typography>
          </IconWrapper>
          <IconWrapper>
            <AttachMoneyIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Cost: {dest.cost}
            </Typography>
          </IconWrapper>
          <IconWrapper>
            <AcUnitIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Climate: {dest.climate}
            </Typography>
          </IconWrapper>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          View Details
        </Button>
        <Button size="small" color="primary">
          Add to Trip
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default DestinationCard;