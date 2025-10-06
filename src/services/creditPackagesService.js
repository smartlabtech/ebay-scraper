import axiosInstance from '../api/axios';

class CreditPackagesService {
  // Get all credit packages
  async getCreditPackages(filters = {}) {
    try {
      const params = {
        isActive: filters.isActive !== undefined ? filters.isActive : true,
        isPopular: filters.isPopular,
        page: filters.page || 1,
        limit: filters.limit || 20
      };

      const response = await axiosInstance.get('/en/credit-packages', { params });
      console.log('Credit packages API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching credit packages:', error);
      throw error;
    }
  }

  // Get single credit package
  async getCreditPackage(packageId) {
    try {
      const response = await axiosInstance.get(`/en/credit-packages/${packageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching credit package:', error);
      throw error;
    }
  }

  // Create new credit package
  async createCreditPackage(packageData) {
    try {
      const response = await axiosInstance.post('/en/credit-packages', packageData);
      return response.data;
    } catch (error) {
      console.error('Error creating credit package:', error);
      throw error;
    }
  }

  // Update credit package
  async updateCreditPackage(packageId, updates) {
    try {
      // Remove fields that aren't allowed in PATCH requests
      const { _id, createdAt, updatedAt, ...allowedUpdates } = updates;

      const response = await axiosInstance.patch(`/en/credit-packages/${packageId}`, allowedUpdates);
      return response.data;
    } catch (error) {
      console.error('Error updating credit package:', error);
      throw error;
    }
  }

  // Delete credit package
  async deleteCreditPackage(packageId) {
    try {
      await axiosInstance.delete(`/en/credit-packages/${packageId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting credit package:', error);
      throw error;
    }
  }

  // Activate/Deactivate credit package
  async togglePackageStatus(packageId, isActive) {
    try {
      const response = await axiosInstance.patch(`/en/credit-packages/${packageId}`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error toggling credit package status:', error);
      throw error;
    }
  }
}

const creditPackagesService = new CreditPackagesService();
export default creditPackagesService;