// User Types
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
};

// Store Types
export const STORE_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  INACTIVE: 'inactive'
};

// API Status Types
export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Form Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  MIN_LENGTH: (min) => `Must be at least ${min} characters`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
  PASSWORD_MATCH: 'Passwords do not match',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_PHONE: 'Please enter a valid phone number'
};

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ebay_manager_auth_token',
  USER_DATA: 'ebay_manager_user_data',
  THEME: 'ebay_manager_theme',
  ONBOARDING_COMPLETED: 'ebay_manager_onboarding_completed'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email'
  },
  STORES: {
    LIST: '/stores',
    CREATE: '/stores',
    GET: (id) => `/stores/${id}`,
    UPDATE: (id) => `/stores/${id}`,
    DELETE: (id) => `/stores/${id}`,
    SYNC: (id) => `/stores/${id}/sync`,
    ANALYTICS: (id) => `/stores/${id}/analytics`
  }
};