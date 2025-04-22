import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import AcUnitIcon from '@material-ui/icons/AcUnit';

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
    margin: '1rem',
  },
  media: {
    height: 140,
  },
  location: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 5,
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '8px 0',
  },
});

const DestinationCard = ({ destination }) => {
  const classes = useStyles();
  const { _id, name, location, description, images, budgetLevel, climate } = destination;

  // Helper to render budget level
  const renderBudget = (level) => {
    switch(level) {
      case 'budget':
        return <AttachMoneyIcon />;
      case 'moderate':
        return (<><AttachMoneyIcon /><AttachMoneyIcon /></>);
      case 'luxury':
        return (<><AttachMoneyIcon /><AttachMoneyIcon /><AttachMoneyIcon /></>);
      default:
        return <AttachMoneyIcon />;
    }
  };

  return (
    <Card className={classes.root}>
      <CardActionArea component={Link} to={`/destinations/${_id}`}>
        <CardMedia
          className={classes.media}
          image={images && images.length > 0 ? images[0] : 'https://via.placeholder.com/300x150?text=No+Image+Available'}
          title={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <div className={classes.location}>
            <LocationOnIcon className={classes.icon} fontSize="small" />
            <Typography variant="body2" color="textSecondary">
              {location.city}, {location.country}
            </Typography>
          </div>
          <div className={classes.details}>
            <div>
              <Typography component="span" variant="body2" color="textSecondary">
                Budget: 
              </Typography>
              {renderBudget(budgetLevel)}
            </div>
            <div>
              <AcUnitIcon className={classes.icon} fontSize="small" />
              <Typography component="span" variant="body2" color="textSecondary">
                {climate}
              </Typography>
            </div>
          </div>
          <Typography variant="body2" color="textSecondary" component="p">
            {description.substring(0, 100)}...
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" component={Link} to={`/destinations/${_id}`}>
          Learn More
        </Button>
        <Button size="small" color="primary" component={Link} to={`/book/${_id}`}>
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default DestinationCard;