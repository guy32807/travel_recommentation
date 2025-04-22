const express = require('express');
const router = express.Router();
const RecommendationController = require('../controllers/recommendationController');

const recommendationController = new RecommendationController();

// Get all destinations
router.get('/', recommendationController.getAllDestinations.bind(recommendationController));

// Search destinations
router.get('/search', recommendationController.searchDestinations.bind(recommendationController));

// Get a destination by ID
router.get('/:id', recommendationController.getDestinationById.bind(recommendationController));

// Create a new destination
router.post('/', recommendationController.createDestination.bind(recommendationController));

// Update a destination
router.put('/:id', recommendationController.updateDestination.bind(recommendationController));

// Delete a destination
router.delete('/:id', recommendationController.deleteDestination.bind(recommendationController));

module.exports = router;