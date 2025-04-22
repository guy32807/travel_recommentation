class RecommendationService {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }

    async fetchRecommendations(location, checkInDate, checkOutDate) {
        try {
            const response = await this.apiClient.get(`/recommendations`, {
                params: {
                    location,
                    checkIn: checkInDate,
                    checkOut: checkOutDate
                }
            });
            return response.data;
        } catch (error) {
            throw new Error('Error fetching recommendations: ' + error.message);
        }
    }

    async fetchDestinationDetails(destinationId) {
        try {
            const response = await this.apiClient.get(`/destinations/${destinationId}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching destination details: ' + error.message);
        }
    }
}

export default RecommendationService;