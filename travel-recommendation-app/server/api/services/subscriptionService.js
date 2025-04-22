const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class SubscriptionService {
  async createSubscription(customerId, priceId) {
    try {
      // Create the subscription
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });
      
      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      };
    } catch (error) {
      console.error('Subscription creation failed:', error);
      throw error;
    }
  }
  
  // Additional subscription management methods
}

module.exports = new SubscriptionService();