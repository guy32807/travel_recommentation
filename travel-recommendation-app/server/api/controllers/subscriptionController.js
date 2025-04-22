const SubscriptionService = require('../services/subscriptionService');

class SubscriptionController {
  async createSubscription(req, res) {
    try {
      const { customerId, priceId } = req.body;
      const result = await SubscriptionService.createSubscription(customerId, priceId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
  
  // Add more subscription-related controllers
}

module.exports = new SubscriptionController();