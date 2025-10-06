import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCurrentSubscription,
  fetchSubscriptionUsage,
  selectCurrentSubscription,
  selectSubscriptionUsage,
  selectSubscriptionLoading,
  selectIsInitialLoading,
  selectSubscriptionError,
  selectPlanName,
  selectCreditsRemaining,
  selectCreditsRenewAt,
  selectPlanFeatures,
  selectIsSubscriptionActive,
  selectHasLoadedOnce
} from '../store/slices/subscriptionSlice';

// Track ongoing requests to prevent duplicates
let subscriptionLoadingPromise = null;

export const useSubscription = () => {
  const dispatch = useDispatch();

  const currentSubscription = useSelector(selectCurrentSubscription);
  const usage = useSelector(selectSubscriptionUsage);
  const loading = useSelector(selectIsInitialLoading); // Use the combined selector
  const error = useSelector(selectSubscriptionError);
  const planName = useSelector(selectPlanName);
  const creditsRemaining = useSelector(selectCreditsRemaining);
  const creditsRenewAt = useSelector(selectCreditsRenewAt);
  const planFeatures = useSelector(selectPlanFeatures);
  const isActive = useSelector(selectIsSubscriptionActive);
  const hasLoadedOnce = useSelector(selectHasLoadedOnce);

  useEffect(() => {
    // Only fetch if not already loaded and no request in progress
    const loadSubscriptions = async () => {
      // Load current subscription if not already loaded
      if (!hasLoadedOnce) {
        // Double-check and set promise atomically to prevent race conditions
        if (!subscriptionLoadingPromise) {
          // Immediately set the promise to prevent other components from starting a duplicate
          const promise = dispatch(fetchCurrentSubscription());
          subscriptionLoadingPromise = promise;
          console.log('Loading current subscription for the first time');

          promise.finally(() => {
            subscriptionLoadingPromise = null;
          });
        } else {
          console.log('Subscription already loading (caught by race condition check), skipping duplicate request');
        }
      }
    };

    loadSubscriptions();
  }, [dispatch, hasLoadedOnce]);

  const refreshSubscription = async (forceReload = false) => {
    // Force reload bypasses duplicate checking
    if (forceReload) {
      console.log('Force reloading subscriptions');
      subscriptionLoadingPromise = dispatch(fetchCurrentSubscription())
        .finally(() => {
          subscriptionLoadingPromise = null;
        });
      await subscriptionLoadingPromise;
      return;
    }

    // Otherwise check for duplicates
    if (!subscriptionLoadingPromise) {
      console.log('Refreshing current subscription');
      subscriptionLoadingPromise = dispatch(fetchCurrentSubscription())
        .finally(() => {
          subscriptionLoadingPromise = null;
        });
    } else {
      console.log('Current subscription already loading, returning existing promise');
    }

    await subscriptionLoadingPromise;
  };

  const loadUsage = () => {
    dispatch(fetchSubscriptionUsage());
  };

  // Helper functions
  const isUnlimited = (feature) => {
    return planFeatures && planFeatures[feature] === -1;
  };

  const getFeatureLimit = (feature) => {
    if (!planFeatures || planFeatures[feature] === undefined) return 0;
    const limit = planFeatures[feature];
    return limit === -1 ? 'Unlimited' : limit;
  };

  const getFeatureDisplay = (feature) => {
    if (!planFeatures || planFeatures[feature] === undefined) return '0';
    const limit = planFeatures[feature];
    if (limit === -1) return '∞';
    return limit.toString();
  };

  return {
    // State
    currentSubscription,
    usage,
    loading,
    error,
    planName,
    creditsRemaining,
    creditsRenewAt,
    planFeatures,
    isActive,
    
    // Actions
    refreshSubscription,
    loadUsage,
    
    // Helpers
    isUnlimited,
    getFeatureLimit,
    getFeatureDisplay
  };
};