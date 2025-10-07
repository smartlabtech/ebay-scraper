// API Configuration
export const API_CONFIG = {
  BASE_URL: `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3041/api'}/${import.meta.env.VITE_API_LANG || 'en'}`,
  TIMEOUT: 30000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/signin',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL: '/auth/verify-email',

  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',

  // Stores
  STORES: '/stores',
  STORE_BY_ID: (id) => `/stores/${id}`,
  CREATE_STORE: '/stores',
  UPDATE_STORE: (id) => `/stores/${id}`,
  DELETE_STORE: (id) => `/stores/${id}`,
  SYNC_STORE: (id) => `/stores/${id}/sync`,
  STORE_ANALYTICS: (id) => `/stores/${id}/analytics`,
  IMPORT_STORES: '/stores/import',
};