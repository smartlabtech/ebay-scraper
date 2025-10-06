import { API_CONFIG } from '../config/api';
import { STORAGE_KEYS } from '../types';

const subscriptionService = {
  // Get current subscription
  async getCurrentSubscription() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/subscription/current`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription');
    }

    return response.json();
  },

  // Get subscription usage
  async getSubscriptionUsage() {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/subscription/usage`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription usage');
    }

    return response.json();
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/subscription/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }

    return response.json();
  },

  // Reactivate subscription
  async reactivateSubscription(subscriptionId) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/subscription/${subscriptionId}/reactivate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to reactivate subscription');
    }

    return response.json();
  },

  // Change subscription plan
  async changePlan(planId) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    const response = await fetch(`${API_CONFIG.BASE_URL}/subscription/change-plan`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ planId })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to change subscription plan');
    }

    return response.json();
  }
  // Note: getScheduledSubscription and cancelScheduledSubscription methods have been removed
  // as these endpoints are no longer supported by the backend
};

export default subscriptionService;