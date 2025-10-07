import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import webscraperService from '../../services/webscraper';

// Initial state
const initialState = {
  jobs: [],
  currentJob: null,
  pagination: {
    page: 1,
    limit: 50,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  },
  filters: {
    scrapingjob_id: '',
    custom_id: '',
    sitemap_id: '',
    sitemap_name: '',
    status: '',
    scrapingResultMin: '',
    scrapingResultMax: '',
    createdAt: '',
    sortProperty: 'createdAt',
    sortType: 'DESCENDING'
  },
  loading: false,
  error: null
};

// Async thunks
export const fetchWebscraperJobs = createAsyncThunk(
  'webscraper/fetchJobs',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await webscraperService.getWebscraperJobsWithFilters(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWebscraperJobById = createAsyncThunk(
  'webscraper/fetchJobById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await webscraperService.getWebscraperJobById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Webscraper slice
const webscraperSlice = createSlice({
  name: 'webscraper',
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
    clearCurrentJob: (state) => {
      state.currentJob = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch webscraper jobs
    builder
      .addCase(fetchWebscraperJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebscraperJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchWebscraperJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch job by ID
      .addCase(fetchWebscraperJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWebscraperJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentJob = action.payload.data;
      })
      .addCase(fetchWebscraperJobById.rejected, (state, action) => {
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
  clearCurrentJob
} = webscraperSlice.actions;

// Selectors
export const selectWebscraperJobs = (state) => state.webscraper.jobs;
export const selectCurrentJob = (state) => state.webscraper.currentJob;
export const selectPagination = (state) => state.webscraper.pagination;
export const selectFilters = (state) => state.webscraper.filters;
export const selectLoading = (state) => state.webscraper.loading;
export const selectError = (state) => state.webscraper.error;

export default webscraperSlice.reducer;
