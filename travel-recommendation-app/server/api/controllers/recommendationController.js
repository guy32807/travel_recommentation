const Destination = require('../models/Destination');

class RecommendationController {
    constructor() {
        // Initialize any controller properties here if needed
    }

    // Get all destinations
    async getAllDestinations(req, res) {
        try {
            const destinations = await Destination.find();
            res.status(200).json(destinations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Get a destination by ID
    async getDestinationById(req, res) {
        try {
            const destination = await Destination.findById(req.params.id);
            if (!destination) {
                return res.status(404).json({ message: 'Destination not found' });
            }
            res.status(200).json(destination);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Create a new destination
    async createDestination(req, res) {
        try {
            const newDestination = new Destination(req.body);
            const savedDestination = await newDestination.save();
            res.status(201).json(savedDestination);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Update a destination
    async updateDestination(req, res) {
        try {
            const updatedDestination = await Destination.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!updatedDestination) {
                return res.status(404).json({ message: 'Destination not found' });
            }
            res.status(200).json(updatedDestination);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Delete a destination
    async deleteDestination(req, res) {
        try {
            const deletedDestination = await Destination.findByIdAndDelete(req.params.id);
            if (!deletedDestination) {
                return res.status(404).json({ message: 'Destination not found' });
            }
            res.status(200).json({ message: 'Destination deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Search destinations by criteria
    async searchDestinations(req, res) {
        try {
            const { budget, climate, activity } = req.query;
            const query = {};
            
            if (budget) query.budgetLevel = budget;
            if (climate) query.climate = climate;
            if (activity) query.activities = { $in: [activity] };
            
            const destinations = await Destination.find(query);
            res.status(200).json(destinations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = RecommendationController;