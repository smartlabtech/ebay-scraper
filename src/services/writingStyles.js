import api from './api';

// Writing Styles API Service
const writingStylesApi = {
  // Get all writing styles with optional filters
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit || 10);
      if (params.projectId) queryParams.append('projectId', params.projectId);
      
      const queryString = queryParams.toString();
      const url = queryString ? `/writing-style?${queryString}` : '/writing-style';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching writing styles:', error);
      throw error;
    }
  },

  // Get writing style by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/writing-style/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching writing style:', error);
      throw error;
    }
  },

  // Create new writing style
  create: async (data) => {
    try {
      const response = await api.post('/writing-style', {
        projectId: data.projectId,
        tags: data.tags || [],
        sample: data.sample
      });
      return response.data;
    } catch (error) {
      console.error('Error creating writing style:', error);
      throw error;
    }
  },

  // Update writing style
  update: async (id, data) => {
    try {
      const response = await api.patch(`/writing-style/${id}`, {
        tags: data.tags,
        sample: data.sample
      });
      return response.data;
    } catch (error) {
      console.error('Error updating writing style:', error);
      throw error;
    }
  },

  // Delete writing style
  delete: async (id) => {
    try {
      const response = await api.delete(`/writing-style/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting writing style:', error);
      throw error;
    }
  }
};

export default writingStylesApi;