import axiosInstance from '../api/axios';

class AnalyticsService {
  // Get analytics data
  async getAnalytics() {
    try {
      const response = await axiosInstance.get('/analytics');
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch analytics data');
    }
  }
}

// Create and export analytics service instance
const analyticsService = new AnalyticsService();
export default analyticsService;
