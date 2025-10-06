import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import subscriptionService from '../../services/subscription';

// Async thunks
export const fetchCurrentSubscription = createAsyncThunk(
  'subscription/fetchCurrent',
  async () => {
    const response = await subscriptionService.getCurrentSubscription();
    console.log('Subscription API response:', response);
    return response;
  }
);

export const fetchSubscriptionUsage = createAsyncThunk(
  'subscription/fetchUsage',
  async () => {
    const response = await subscriptionService.getSubscriptionUsage();
    return response;
  }
);

export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (subscriptionId) => {
    const response = await subscriptionService.cancelSubscription(subscriptionId);
    return response;
  }
);

export const reactivateSubscription = createAsyncThunk(
  'subscription/reactivate',
  async (subscriptionId) => {
    const response = await subscriptionService.reactivateSubscription(subscriptionId);
    return response;
  }
);

export const changeSubscriptionPlan = createAsyncThunk(
  'subscription/changePlan',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await subscriptionService.changePlan(planId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Note: fetchScheduledSubscription and cancelScheduledSubscription have been removed
// as these endpoints are no longer supported by the backend

// Initial state
const initialState = {
  currentSubscription: null,
  usage: null,
  loading: false,
  error: null,
  hasLoadedOnce: false // Track if subscription has been fetched at least once
};

// Subscription slice
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateCreditsRemaining: (state, action) => {
      if (state.currentSubscription) {
        state.currentSubscription.creditsRemaining = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch current subscription
    builder
      .addCase(fetchCurrentSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
        state.error = null;
        state.hasLoadedOnce = true; // Mark as loaded
      })
      .addCase(fetchCurrentSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch subscription';
        state.hasLoadedOnce = true; // Mark as loaded even on error
      });

    // Fetch subscription usage
    builder
      .addCase(fetchSubscriptionUsage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.usage = action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptionUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch usage';
      });

    // Cancel subscription
    builder
      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
        state.error = null;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to cancel subscription';
      });

    // Reactivate subscription
    builder
      .addCase(reactivateSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reactivateSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
        state.error = null;
      })
      .addCase(reactivateSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reactivate subscription';
      });

    // Change subscription plan
    builder
      .addCase(changeSubscriptionPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeSubscriptionPlan.fulfilled, (state, action) => {
        state.loading = false;
        // The response should contain the updated subscription or scheduled change info
        // Update based on what the API returns
        if (action.payload.subscription) {
          state.currentSubscription = action.payload.subscription;
        }
        state.error = null;
      })
      .addCase(changeSubscriptionPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to change subscription plan';
      });

    // Note: Scheduled subscription cases have been removed
  }
});

// Export actions
export const { clearError, updateCreditsRemaining } = subscriptionSlice.actions;

// Export selectors
export const selectCurrentSubscription = (state) => state.subscription.currentSubscription;
// selectScheduledSubscription removed - no longer supported
export const selectSubscriptionUsage = (state) => state.subscription.usage;
export const selectSubscriptionLoading = (state) => state.subscription.loading;
export const selectSubscriptionError = (state) => state.subscription.error;
export const selectHasLoadedOnce = (state) => state.subscription.hasLoadedOnce;
// selectHasLoadedScheduledOnce removed - no longer needed

// Combined selector for initial loading state
export const selectIsInitialLoading = createSelector(
  [selectSubscriptionLoading, selectHasLoadedOnce],
  (loading, hasLoadedOnce) => !hasLoadedOnce || loading
);

// Default empty object to avoid creating new references
const EMPTY_FEATURES = {};

// Computed selectors
export const selectPlanName = (state) => state.subscription.currentSubscription?.planId?.name || 'Free';
export const selectCreditsRemaining = (state) => state.subscription.currentSubscription?.userId?.credits || 0;
export const selectCreditsRenewAt = (state) => state.subscription.currentSubscription?.creditsRenewAt;

// Memoized selector for plan features to avoid unnecessary re-renders
export const selectPlanFeatures = createSelector(
  [selectCurrentSubscription],
  (currentSubscription) => currentSubscription?.planId?.features || EMPTY_FEATURES
);

export const selectIsSubscriptionActive = (state) => state.subscription.currentSubscription?.status === 'active';

// Export reducer
export default subscriptionSlice.reducer;