import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import keywordsService from '../../services/keywords';

// Initial state
const initialState = {
  keywords: [],
  currentKeyword: null,
  pagination: {
    page: 1,
    limit: 50,
    totalRecords: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  },
  filters: {
    keyword: '',
    keywordLink: '',
    createdAt: '',
    searchResultMin: '',
    searchResultMax: '',
    search: '',
    sortProperty: 'createdAt',
    sortType: 'DESCENDING'
  },
  loading: false,
  error: null
};

// Async thunks
export const fetchKeywords = createAsyncThunk(
  'keywords/fetchKeywords',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await keywordsService.getKeywordsWithFilters(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchKeywordById = createAsyncThunk(
  'keywords/fetchKeywordById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await keywordsService.getKeywordById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchKeywords = createAsyncThunk(
  'keywords/searchKeywords',
  async ({ search, ...params }, { rejectWithValue }) => {
    try {
      const response = await keywordsService.searchKeywords(search, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createKeyword = createAsyncThunk(
  'keywords/createKeyword',
  async (keyword, { rejectWithValue }) => {
    try {
      const response = await keywordsService.createKeyword(keyword);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Keywords slice
const keywordsSlice = createSlice({
  name: 'keywords',
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
    clearCurrentKeyword: (state) => {
      state.currentKeyword = null;
    },
    addKeywordToList: (state, action) => {
      // Add keyword to the beginning of the list
      state.keywords.unshift(action.payload);
      // Update total records
      state.pagination.totalRecords += 1;
    }
  },
  extraReducers: (builder) => {
    // Fetch keywords
    builder
      .addCase(fetchKeywords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKeywords.fulfilled, (state, action) => {
        state.loading = false;
        state.keywords = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchKeywords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch keyword by ID
      .addCase(fetchKeywordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKeywordById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentKeyword = action.payload.data;
      })
      .addCase(fetchKeywordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Search keywords
      .addCase(searchKeywords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchKeywords.fulfilled, (state, action) => {
        state.loading = false;
        state.keywords = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(searchKeywords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create keyword (don't set global loading to avoid page overlay)
      .addCase(createKeyword.pending, (state) => {
        // Don't set loading = true to avoid showing page loader
        state.error = null;
      })
      .addCase(createKeyword.fulfilled, (state, action) => {
        // Add the new keyword to the beginning of the list
        state.keywords.unshift(action.payload);
        // Update total records
        state.pagination.totalRecords += 1;
      })
      .addCase(createKeyword.rejected, (state, action) => {
        // Don't store error in Redux state, handle it in the component
        // This prevents duplicate error messages
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
  clearCurrentKeyword,
  addKeywordToList
} = keywordsSlice.actions;

// Selectors
export const selectKeywords = (state) => state.keywords.keywords;
export const selectCurrentKeyword = (state) => state.keywords.currentKeyword;
export const selectPagination = (state) => state.keywords.pagination;
export const selectFilters = (state) => state.keywords.filters;
export const selectLoading = (state) => state.keywords.loading;
export const selectError = (state) => state.keywords.error;

export default keywordsSlice.reducer;
