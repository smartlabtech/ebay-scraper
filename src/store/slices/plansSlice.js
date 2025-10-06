import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import plansService from '../../services/plans';

// Async thunks
export const fetchPlans = createAsyncThunk(
  'plans/fetch',
  async (includeInactive = false) => {
    const response = await plansService.getPlans(includeInactive);
    return response;
  }
);

// Keep for backward compatibility
export const fetchPublicPlans = createAsyncThunk(
  'plans/fetchPublic',
  async () => {
    // Don't pass any parameter for public plans - let backend decide what to show
    const response = await plansService.getPlans();
    return response;
  }
);

export const fetchPlanById = createAsyncThunk(
  'plans/fetchById',
  async (planId) => {
    const response = await plansService.getPlanById(planId);
    return response;
  }
);

// Initial state
const initialState = {
  plans: [],
  selectedPlan: null,
  loading: false,
  error: null
};

// Plans slice
const plansSlice = createSlice({
  name: 'plans',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedPlan: (state, action) => {
      state.selectedPlan = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch public plans
    builder
      .addCase(fetchPublicPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicPlans.fulfilled, (state, action) => {
        state.loading = false;
        // Sort plans by price (free first, then by ascending price)
        state.plans = action.payload.sort((a, b) => {
          if (a.price === 0) return -1;
          if (b.price === 0) return 1;
          return a.price - b.price;
        });
        state.error = null;
      })
      .addCase(fetchPublicPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plans';
      });

    // Fetch plan by ID
    builder
      .addCase(fetchPlanById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlanById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPlan = action.payload;
        state.error = null;
      })
      .addCase(fetchPlanById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch plan';
      });
  }
});

// Export actions
export const { clearError, setSelectedPlan } = plansSlice.actions;

// Export selectors
export const selectAllPlans = (state) => state.plans.plans;
export const selectSelectedPlan = (state) => state.plans.selectedPlan;
export const selectPlansLoading = (state) => state.plans.loading;
export const selectPlansError = (state) => state.plans.error;

// Helper selectors
export const selectPlanById = (planId) => (state) => 
  state.plans.plans.find(plan => plan._id === planId);

export const selectPopularPlan = (state) => 
  state.plans.plans.find(plan => plan.isPopular) || state.plans.plans[1]; // Default to second plan if no popular

// Export reducer
export default plansSlice.reducer;