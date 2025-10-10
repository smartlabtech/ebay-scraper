import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import manifestsService from '../../services/manifests';

// Initial state
const initialState = {
  manifests: [],
  currentManifest: null,
  pagination: {
    page: 1,
    limit: 50,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  },
  filters: {
    type: '',
    status: '',
    excludeStatus: ['SUCCESS'],
    _id: '',
    scrapingjobId: '',
    scrapingjobStatus: '',
    trialsMin: '',
    trialsMax: '',
    createdAt: '',
    sortProperty: 'createdAt',
    sortType: 'DESCENDING'
  },
  loading: false,
  error: null
};

// Async thunks
export const fetchManifests = createAsyncThunk(
  'manifests/fetchManifests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await manifestsService.getManifestsWithFilters(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchManifestById = createAsyncThunk(
  'manifests/fetchManifestById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await manifestsService.getManifestById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Manifests slice
const manifestsSlice = createSlice({
  name: 'manifests',
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
    clearCurrentManifest: (state) => {
      state.currentManifest = null;
    },
    updateManifestStatus: (state, action) => {
      const { manifestId, status } = action.payload;
      const manifest = state.manifests.find(m => m._id === manifestId);
      if (manifest) {
        manifest.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch manifests
    builder
      .addCase(fetchManifests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManifests.fulfilled, (state, action) => {
        state.loading = false;
        state.manifests = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchManifests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch manifest by ID
      .addCase(fetchManifestById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManifestById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentManifest = action.payload.data;
      })
      .addCase(fetchManifestById.rejected, (state, action) => {
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
  clearCurrentManifest,
  updateManifestStatus
} = manifestsSlice.actions;

// Selectors
export const selectManifests = (state) => state.manifests.manifests;
export const selectCurrentManifest = (state) => state.manifests.currentManifest;
export const selectPagination = (state) => state.manifests.pagination;
export const selectFilters = (state) => state.manifests.filters;
export const selectLoading = (state) => state.manifests.loading;
export const selectError = (state) => state.manifests.error;

export default manifestsSlice.reducer;
