import api from './api';
import { TOKEN_COSTS } from '../types';

// Brand Messages API Service
const brandMessagesApi = {
  // Get all brand messages with optional filters
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        // Skip 'all' values, empty values, and sortBy
        if (value !== undefined && value !== null && value !== '' && value !== 'all' && key !== 'sortBy') {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = queryString ? `/brandMessage?${queryString}` : '/brandMessage';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching brand messages:', error);
      throw error;
    }
  },

  // Get brand message by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/brandMessage/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching brand message:', error);
      throw error;
    }
  },

  // Create new brand message
  create: async (data) => {
    try {
      const response = await api.post('/brandMessage', data);
      return response.data;
    } catch (error) {
      console.error('Error creating brand message:', error);
      throw error;
    }
  },

  // Update brand message
  update: async (id, updates) => {
    try {
      const response = await api.patch(`/brandMessage/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating brand message:', error);
      throw error;
    }
  },

  // Delete brand message (soft delete)
  delete: async (id) => {
    try {
      const response = await api.delete(`/brandMessage/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting brand message:', error);
      throw error;
    }
  },

  // Generate AI brand message
  generateAI: async (params) => {
    try {
      const response = await api.post('/brandMessage/generate', params);
      return response.data;
    } catch (error) {
      console.error('Error generating AI brand message:', error);
      throw error;
    }
  },

  // Test brand message
  test: async (id) => {
    try {
      const response = await api.post(`/brandMessage/${id}/test`);
      return response.data;
    } catch (error) {
      console.error('Error testing brand message:', error);
      throw error;
    }
  },

  // Create variant of brand message
  createVariant: async (id, variant) => {
    try {
      const response = await api.post(`/brandMessage/${id}/variant`, variant);
      return response.data;
    } catch (error) {
      console.error('Error creating brand message variant:', error);
      throw error;
    }
  },

  // Calculate token cost
  calculateTokenCost: () => {
    return TOKEN_COSTS.BRAND_MESSAGE || 50;
  }
};

export default brandMessagesApi;