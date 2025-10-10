import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storesService from '../../services/stores';

// Initial state
const initialState = {
  stores: [],
  currentStore: null,
  pagination: {
    page: 1,
    limit: 50,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  },
  filters: {
    location: '',
    storeLink: '',
    stage: '',
    createdAt: '',
    memberSince: '',
    memberSinceBefore: '',
    soldMin: '',
    soldMax: '',
    searchAllMin: '',
    searchAllMax: '',
    soldDeltaMin: '',
    soldDeltaMax: '',
    searchAllDeltaMin: '',
    searchAllDeltaMax: '',
    lastScrapedAt: '',
    lastScrapedAtBefore: '',
    search: '',
    sortProperty: 'createdAt',
    sortType: 'DESCENDING'
  },
  loading: false,
  error: null
};

// Async thunks
export const fetchStores = createAsyncThunk(
  'stores/fetchStores',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await storesService.getStoresWithFilters(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchStoreById = createAsyncThunk(
  'stores/fetchStoreById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await storesService.getStoreById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchStores = createAsyncThunk(
  'stores/searchStores',
  async ({ search, ...params }, { rejectWithValue }) => {
    try {
      const response = await storesService.searchStores(search, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Stores slice
const storesSlice = createSlice({
  name: 'stores',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
    },
    setSortProperty: (state, action) => {
      state.filters.sortProperty = action.payload;
    },
    setSortType: (state, action) => {
      state.filters.sortType = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentStore: (state) => {
      state.currentStore = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch stores
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch store by ID
      .addCase(fetchStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStore = action.payload.data;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search stores
      .addCase(searchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(searchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  setFilters,
  resetFilters,
  setPage,
  setLimit,
  setSortProperty,
  setSortType,
  clearError,
  clearCurrentStore
} = storesSlice.actions;

// Selectors
export const selectStores = (state) => state.stores.stores;
export const selectCurrentStore = (state) => state.stores.currentStore;
export const selectPagination = (state) => state.stores.pagination;
export const selectFilters = (state) => state.stores.filters;
export const selectLoading = (state) => state.stores.loading;
export const selectError = (state) => state.stores.error;

export default storesSlice.reducer;