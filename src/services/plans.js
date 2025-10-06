import { API_CONFIG } from '../config/api';
import { STORAGE_KEYS } from '../types';

// Track ongoing requests to prevent duplicates
const publicPlansPromise = { current: null };
const plansPromises = new Map();

const plansService = {
  // Get all plans (with credit packages for authenticated users)
  async getPlans(includeInactive) {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const cacheKey = `plans_${includeInactive || 'default'}_${!!token}`;

    // Check if this request is already in progress
    if (plansPromises.has(cacheKey)) {
      console.log(`Plans request (includeInactive=${includeInactive}, auth=${!!token}) already in progress, reusing`);
      return plansPromises.get(cacheKey);
    }

    // Create the request promise
    const plansPromise = (async () => {
      // Try authenticated endpoint first if token exists
      if (token) {
        try {
          const url = new URL(`${API_CONFIG.BASE_URL}/plan`);
          // Only add includeInactive parameter if explicitly set to true
          // This prevents sending includeInactive=false for public/user pages
          if (includeInactive === true) {
            url.searchParams.append('includeInactive', 'true');
          }

          const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            return response.json();
          }
        } catch (error) {
          console.warn('Failed to fetch authenticated plans, falling back to public:', error);
        }
      }

      // Fallback to public endpoint (which has its own deduplication)
      return this.getPublicPlans();
    })();

    // Store the promise
    plansPromises.set(cacheKey, plansPromise);

    // Clean up after completion
    plansPromise.finally(() => {
      plansPromises.delete(cacheKey);
    });

    return plansPromise;
  },

  // Get all public plans (fallback)
  async getPublicPlans() {
    // Check if public plans are already being fetched
    if (publicPlansPromise.current) {
      console.log('Public plans already being fetched, reusing existing request');
      return publicPlansPromise.current;
    }

    // Create the request promise
    publicPlansPromise.current = fetch(`${API_CONFIG.BASE_URL}/plan/public`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch plans');
      }
      return response.json();
    }).finally(() => {
      // Clean up after completion
      publicPlansPromise.current = null;
    });

    return publicPlansPromise.current;
  },

  // Get plan details by ID
  async getPlanById(planId) {
    const response = await fetch(`${API_CONFIG.BASE_URL}/plan/${planId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch plan details');
    }

    return response.json();
  }
};

export default plansService;