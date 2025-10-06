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
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // User
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  
  // Projects
  PROJECTS: '/projects',
  PROJECT_BY_ID: (id) => `/projects/${id}`,
  
  // Subscription
  CURRENT_SUBSCRIPTION: '/subscription/current',
  SUBSCRIPTION_USAGE: '/subscription/usage',
  CANCEL_SUBSCRIPTION: (id) => `/subscription/${id}/cancel`,
  REACTIVATE_SUBSCRIPTION: (id) => `/subscription/${id}/reactivate`,
  
  // Brand Messages
  BRAND_MESSAGES: '/brand-messages',
  BRAND_MESSAGE_BY_ID: (id) => `/brand-messages/${id}`,
  
  // Copies
  COPIES: '/copies',
  COPY_BY_ID: (id) => `/copies/${id}`,
  
  // Analytics
  ANALYTICS_OVERVIEW: '/analytics/overview',
  ANALYTICS_PERFORMANCE: '/analytics/performance',
  
  // Payments
  CREATE_CHECKOUT: '/payments/create-checkout',
  PAYMENT_SUCCESS: '/payments/success',
  PAYMENT_CANCEL: '/payments/cancel',
};