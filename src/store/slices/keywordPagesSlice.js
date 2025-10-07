import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import keywordPagesService from '../../services/keywordPages';

// Initial state
const initialState = {
  keywordPages: [],
  currentKeywordPage: null,
  pagination: {
    page: 1,
    limit: 50,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  },
  filters: {
    link: '',
    keywordId: '',
    originManifestId: '',
    manifestId: '',
    pageNumber: '',
    stage: '',
    createdAt: '',
    pageNumberMin: '',
    pageNumberMax: '',
    search: '',
    sortProperty: 'createdAt',
    sortType: 'DESCENDING'
  },
  loading: false,
  error: null
};

// Async thunks
export const fetchKeywordPages = createAsyncThunk(
  'keywordPages/fetchKeywordPages',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await keywordPagesService.getKeywordPagesWithFilters(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchKeywordPageById = createAsyncThunk(
  'keywordPages/fetchKeywordPageById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await keywordPagesService.getKeywordPageById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Keyword pages slice
const keywordPagesSlice = createSlice({
  name: 'keywordPages',
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
    clearCurrentKeywordPage: (state) => {
      state.currentKeywordPage = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch keyword pages
    builder
      .addCase(fetchKeywordPages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKeywordPages.fulfilled, (state, action) => {
        state.loading = false;
        state.keywordPages = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchKeywordPages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch keyword page by ID
      .addCase(fetchKeywordPageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKeywordPageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKeywordPage = action.payload.data;
      })
      .addCase(fetchKeywordPageById.rejected, (state, action) => {
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
  clearCurrentKeywordPage
} = keywordPagesSlice.actions;

// Selectors
export const selectKeywordPages = (state) => state.keywordPages.keywordPages;
export const selectCurrentKeywordPage = (state) => state.keywordPages.currentKeywordPage;
export const selectPagination = (state) => state.keywordPages.pagination;
export const selectFilters = (state) => state.keywordPages.filters;
export const selectLoading = (state) => state.keywordPages.loading;
export const selectError = (state) => state.keywordPages.error;

export default keywordPagesSlice.reducer;
