import axios from 'axios';
import { STORAGE_KEYS } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3041/api';
const API_LANG = import.meta.env.VITE_API_LANG || 'en';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
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

axiosInstance.interceptors.response.use(
  (response) => {
    // If response contains a new token, update it immediately
    if (response.data?.token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Don't redirect for forgot-password endpoint (401 means email not found)
      const isForgotPassword = error.config?.url?.includes('/auth/forgot-password');
      
      // Only redirect to login if we're not already on auth pages and it's not a forgot-password request
      if (!window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/forgot-password') &&
          !window.location.pathname.includes('/register') &&
          !isForgotPassword) {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;