import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as creditPackagesService from '../../services/creditPackages';

// Async thunks
export const fetchCreditPackages = createAsyncThunk(
  'creditPackages/fetchCreditPackages',
  async (params = {}) => {
    const response = await creditPackagesService.getCreditPackages(params);
    return response;
  }
);

export const initiateCreditPackageOrder = createAsyncThunk(
  'creditPackages/initiateCreditPackageOrder',
  async ({ packageId, metadata = {} }) => {
    const response = await creditPackagesService.initiateCreditPackageOrder(packageId, metadata);
    return response;
  }
);

export const fetchCreditPackageById = createAsyncThunk(
  'creditPackages/fetchCreditPackageById',
  async (packageId) => {
    const response = await creditPackagesService.getCreditPackageById(packageId);
    return response;
  }
);

// Initial state
const initialState = {
  packages: [],
  selectedPackage: null,
  currentOrder: null,
  loading: false,
  initiatingOrder: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20
};

// Slice
const creditPackagesSlice = createSlice({
  name: 'creditPackages',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    setSelectedPackage: (state, action) => {
      state.selectedPackage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch credit packages
      .addCase(fetchCreditPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 20;
      })
      .addCase(fetchCreditPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Initiate credit package order
      .addCase(initiateCreditPackageOrder.pending, (state) => {
        state.initiatingOrder = true;
        state.error = null;
      })
      .addCase(initiateCreditPackageOrder.fulfilled, (state, action) => {
        state.initiatingOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(initiateCreditPackageOrder.rejected, (state, action) => {
        state.initiatingOrder = false;
        state.error = action.error.message;
      })
      // Fetch credit package by ID
      .addCase(fetchCreditPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCreditPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPackage = action.payload;
      })
      .addCase(fetchCreditPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, clearCurrentOrder, setSelectedPackage } = creditPackagesSlice.actions;
export default creditPackagesSlice.reducer;