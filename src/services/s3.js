import axiosInstance from '../api/axios';

class S3Service {
  // Get folder size information
  async getFolderSize(prefix = 'web-scraper/') {
    try {
      const response = await axiosInstance.get(`/s3/folder-size`, {
        params: { prefix }
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch S3 folder size');
    }
  }
}

// Create and export S3 service instance
const s3Service = new S3Service();
export default s3Service;
