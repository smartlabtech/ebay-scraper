import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoading } from '../contexts/LoadingContext';
import {
  fetchPublicPlans,
  fetchPlanById,
  selectAllPlans,
  selectSelectedPlan,
  selectPlansLoading,
  selectPlansError,
  selectPlanById as selectPlanByIdSelector,
  selectPopularPlan,
  setSelectedPlan
} from '../store/slices/plansSlice';

// Track ongoing requests to prevent duplicates
let plansLoadingPromise = null;
let planByIdLoadingPromises = {};

export const usePlans = () => {
  const dispatch = useDispatch();
  const { showLoading, hideLoading } = useLoading();

  const plans = useSelector(selectAllPlans);
  const selectedPlan = useSelector(selectSelectedPlan);
  const loading = useSelector(selectPlansLoading);
  const error = useSelector(selectPlansError);
  const popularPlan = useSelector(selectPopularPlan);

  // Helper to get credit packages for a specific plan
  const getCreditPackagesForPlan = useCallback((planId) => {
    const plan = plans.find(p => p._id === planId);
    return plan?.creditPackages?.filter(pkg => pkg.isActive) || [];
  }, [plans]);

  useEffect(() => {
    // Fetch plans on mount if not already loaded
    if (plans.length === 0 && !loading) {
      const loadPlans = async () => {
        // Check if already loading to prevent duplicates
        if (plansLoadingPromise) {
          console.log('Plans already loading, skipping duplicate request');
          return plansLoadingPromise;
        }

        showLoading('plans', 'Loading subscription plans...');
        try {
          console.log('Loading plans for the first time');
          const promise = dispatch(fetchPublicPlans()).unwrap();
          plansLoadingPromise = promise;

          await promise;
        } finally {
          hideLoading('plans');
          plansLoadingPromise = null;
        }
      };
      loadPlans();
    }
  }, [dispatch, plans.length, loading, showLoading, hideLoading]);

  const refreshPlans = useCallback(async (forceReload = false) => {
    // Force reload bypasses duplicate checking
    if (forceReload) {
      showLoading('plans', 'Refreshing plans...');
      try {
        console.log('Force refreshing plans');
        const promise = dispatch(fetchPublicPlans()).unwrap();
        plansLoadingPromise = promise;
        await promise;
      } finally {
        hideLoading('plans');
        plansLoadingPromise = null;
      }
      return;
    }

    // Otherwise check for duplicates
    if (plansLoadingPromise) {
      console.log('Plans refresh already in progress, returning existing promise');
      return plansLoadingPromise;
    }

    showLoading('plans', 'Refreshing plans...');
    try {
      console.log('Refreshing plans');
      const promise = dispatch(fetchPublicPlans()).unwrap();
      plansLoadingPromise = promise;
      await promise;
    } finally {
      hideLoading('plans');
      plansLoadingPromise = null;
    }
  }, [dispatch, showLoading, hideLoading]);

  const loadPlanById = useCallback(async (planId) => {
    // Check if already loading this specific plan
    if (planByIdLoadingPromises[planId]) {
      console.log(`Plan ${planId} already loading, returning existing promise`);
      return planByIdLoadingPromises[planId];
    }

    showLoading('plan', 'Loading plan details...');
    try {
      console.log(`Loading plan ${planId}`);
      const promise = dispatch(fetchPlanById(planId)).unwrap();
      planByIdLoadingPromises[planId] = promise;
      await promise;
    } finally {
      hideLoading('plan');
      delete planByIdLoadingPromises[planId];
    }
  }, [dispatch, showLoading, hideLoading]);

  const selectPlan = (plan) => {
    dispatch(setSelectedPlan(plan));
  };

  const getPlanById = (planId) => {
    return useSelector(selectPlanByIdSelector(planId));
  };

  // Helper functions
  const formatFeature = (feature, value) => {
    if (value === -1) return 'Unlimited';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value;
  };

  const getPlanFeatures = (plan) => {
    if (!plan) return [];

    const formattedFeatures = [];
    const addedFeatures = new Set(); // Track what we've added to avoid duplicates

    // Helper to add feature without duplication
    const addFeature = (feature) => {
      const normalizedFeature = feature.toLowerCase().trim();
      if (!addedFeatures.has(normalizedFeature)) {
        formattedFeatures.push(feature);
        addedFeatures.add(normalizedFeature);
      }
    };

    // First, add highlighted features (these are the primary selling points)
    if (plan.highlightedFeatures && Array.isArray(plan.highlightedFeatures)) {
      plan.highlightedFeatures.forEach(feature => addFeature(feature));
    }

    // Add structured features from individual properties
    if (plan.credits && !addedFeatures.has('credits')) {
      addFeature(`${plan.credits.toLocaleString()} AI Credits`);
    }

    if (plan.maxProjects !== undefined) {
      if (plan.maxProjects === -1) {
        addFeature('Unlimited Projects');
      } else if (plan.maxProjects > 0) {
        addFeature(`${plan.maxProjects} Projects`);
      }
    }

    if (plan.maxBrandMessages !== undefined) {
      if (plan.maxBrandMessages === -1) {
        addFeature('Unlimited Brand Messages');
      } else if (plan.maxBrandMessages > 0) {
        addFeature(`${plan.maxBrandMessages} Brand Messages`);
      }
    }

    if (plan.maxProductVersions !== undefined) {
      if (plan.maxProductVersions === -1) {
        addFeature('Unlimited Product Versions');
      } else if (plan.maxProductVersions > 0) {
        addFeature(`${plan.maxProductVersions} Product Versions`);
      }
    }

    if (plan.teamMembers !== undefined && plan.teamMembers > 1) {
      if (plan.teamMembers === -1) {
        addFeature('Unlimited Team Members');
      } else {
        addFeature(`${plan.teamMembers} Team Members`);
      }
    }

    if (plan.supportLevel) {
      const supportLevels = {
        'basic': 'Basic Support',
        'priority': 'Priority Support',
        'dedicated': 'Dedicated Support'
      };
      const supportFeature = supportLevels[plan.supportLevel] || plan.supportLevel;
      addFeature(supportFeature);
    }

    if (plan.apiAccess) {
      addFeature('API Access');
    }

    if (plan.customBranding) {
      addFeature('Custom Branding');
    }

    // Finally, add any additional features from the features array
    // that haven't already been added
    if (plan.features && Array.isArray(plan.features)) {
      plan.features.forEach(feature => {
        // Skip if this feature is already covered by structured features
        const featureLower = feature.toLowerCase();
        const isAlreadyCovered =
          featureLower.includes('credit') ||
          featureLower.includes('project') ||
          featureLower.includes('brand message') ||
          featureLower.includes('product version') ||
          featureLower.includes('team') ||
          featureLower.includes('support') ||
          featureLower.includes('api') ||
          featureLower.includes('branding');

        if (!isAlreadyCovered) {
          addFeature(feature);
        }
      });
    }

    return formattedFeatures;
  };

  return {
    // State
    plans,
    selectedPlan,
    loading,
    error,
    popularPlan,

    // Actions
    refreshPlans,
    loadPlanById,
    selectPlan,
    getPlanById,

    // Helpers
    formatFeature,
    getPlanFeatures,
    getCreditPackagesForPlan
  };
};