import axiosInstance from '../api/axios';

class PlansService {
  constructor() {
    // Track ongoing requests to prevent duplicates
    this.plansPromises = new Map();
    this.singlePlanPromises = new Map();
  }

  // Get all plans
  async getPlans(includeInactive) {
    try {
      const cacheKey = `plans_${includeInactive || 'default'}`;

      // Check if this request is already in progress
      if (this.plansPromises.has(cacheKey)) {
        console.log(`Plans (includeInactive=${includeInactive}) already being fetched, reusing existing request`);
        return this.plansPromises.get(cacheKey);
      }

      // Only add includeInactive parameter if explicitly set to true
      // This prevents sending includeInactive=false for public/user pages
      const params = {};
      if (includeInactive === true) {
        params.includeInactive = true;
      }

      // Create the request promise
      const plansPromise = axiosInstance.get('/en/plan', { params })
        .then(response => response.data)
        .catch(error => {
          console.error('Error fetching plans:', error);
          throw error;
        });

      // Store the promise
      this.plansPromises.set(cacheKey, plansPromise);

      // Clean up after completion
      plansPromise.finally(() => {
        this.plansPromises.delete(cacheKey);
      });

      return plansPromise;
    } catch (error) {
      console.error('Error in getPlans:', error);
      throw error;
    }
  }

  // Get single plan
  async getPlan(planId) {
    try {
      // Check if this plan is already being fetched
      if (this.singlePlanPromises.has(planId)) {
        console.log(`Plan ${planId} already being fetched, reusing existing request`);
        return this.singlePlanPromises.get(planId);
      }

      // Create the request promise
      const planPromise = axiosInstance.get(`/en/plan/${planId}`)
        .then(response => response.data)
        .catch(error => {
          console.error('Error fetching plan:', error);
          throw error;
        });

      // Store the promise
      this.singlePlanPromises.set(planId, planPromise);

      // Clean up after completion
      planPromise.finally(() => {
        this.singlePlanPromises.delete(planId);
      });

      return planPromise;
    } catch (error) {
      console.error('Error in getPlan:', error);
      throw error;
    }
  }

  // Create new plan
  async createPlan(planData) {
    try {
      console.log('Creating plan with data:', planData);
      const response = await axiosInstance.post('/en/plan', planData);
      return response.data;
    } catch (error) {
      console.error('Error creating plan:', error);
      console.error('Request data was:', planData);
      throw error;
    }
  }

  // Update plan
  async updatePlan(planId, updates) {
    try {
      // Only include fields that are allowed in PATCH requests
      // Note: currency and billingCycle cannot be changed after creation
      const allowedFields = {
        name: updates.name,
        description: updates.description,
        price: updates.price,
        icon: updates.icon,
        creditValidityDays: updates.creditValidityDays,
        credits: updates.credits,
        maxProjects: updates.maxProjects,
        maxBrandMessages: updates.maxBrandMessages,
        maxProductVersions: updates.maxProductVersions,
        supportLevel: updates.supportLevel,
        apiAccess: updates.apiAccess,
        customBranding: updates.customBranding,
        teamMembers: updates.teamMembers,
        features: updates.features,
        highlightedFeatures: updates.highlightedFeatures,
        trialDays: updates.trialDays,
        noticePeriod: updates.noticePeriod,
        isActive: updates.isActive,
        isDefault: updates.isDefault,
        sortOrder: updates.sortOrder,
        showInLandingPage: updates.showInLandingPage,
        showInUserAccount: updates.showInUserAccount
      };

      // Remove undefined fields
      const cleanedUpdates = Object.fromEntries(
        Object.entries(allowedFields).filter(([_, value]) => value !== undefined)
      );

      // Add metadata if present
      if (updates.metadata) {
        cleanedUpdates.metadata = updates.metadata;
      }

      console.log('Sending PATCH request with:', cleanedUpdates);
      const response = await axiosInstance.patch(`/en/plan/${planId}`, cleanedUpdates);
      return response.data;
    } catch (error) {
      console.error('Error updating plan:', error);
      console.error('Request data was:', updates);
      throw error;
    }
  }

  // Delete plan
  async deletePlan(planId) {
    try {
      await axiosInstance.delete(`/en/plan/${planId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  }

  // Activate/Deactivate plan
  async togglePlanStatus(planId, isActive) {
    try {
      const response = await axiosInstance.patch(`/en/plan/${planId}`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error toggling plan status:', error);
      throw error;
    }
  }
}

const plansService = new PlansService();
export default plansService;