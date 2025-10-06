// API Service with real HTTP requests
import axios from 'axios';
import { API_STATUS, STORAGE_KEYS } from '../types';

// Base API class
class ApiService {
  constructor(baseURL = '') {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3041/api';
    const apiLang = import.meta.env.VITE_API_LANG || 'en';
    this.baseURL = baseURL || `${apiBase}/${apiLang}`;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Set auth token
  setAuthToken(token) {
    if (token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      delete this.client.defaults.headers.common['Authorization'];
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // POST request
  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    try {
      const response = await this.client.patch(endpoint, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // DELETE request
  async delete(endpoint) {
    try {
      const response = await this.client.delete(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // File upload
  async upload(endpoint, file, onProgress) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.client.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        }
      });

      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Create and export API instance
const api = new ApiService(import.meta.env.VITE_API_URL);

export default api;

// Helper function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error
    return {
      message: error.response.data?.message || 'Server error',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request made but no response
    return {
      message: 'Network error - please check your connection',
      status: 0
    };
  } else {
    // Something else happened
    return {
      message: error.message || 'An unexpected error occurred',
      status: -1
    };
  }
};

// Helper to create async thunk payloads
export const createAsyncPayload = async (apiCall) => {
  try {
    const response = await apiCall();
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};