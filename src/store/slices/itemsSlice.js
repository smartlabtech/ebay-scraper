import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import itemsService from '../../services/items';

// Initial state
const initialState = {
  items: [],
  currentItem: null,
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
    title: '',
    keywordId: '',
    storeLink: '',
    category: '',
    stage: '',
    locatedIn: '',
    createdAt: '',
    priceMin: '',
    priceMax: '',
    reviewMin: '',
    reviewMax: '',
    availableMin: '',
    availableMax: '',
    itemSoldMin: '',
    itemSoldMax: '',
    search: '',
    sortProperty: 'createdAt',
    sortType: 'DESCENDING'
  },
  loading: false,
  error: null
};

// Async thunks
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await itemsService.getItemsWithFilters(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchItemById = createAsyncThunk(
  'items/fetchItemById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await itemsService.getItemById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Items slice
const itemsSlice = createSlice({
  name: 'items',
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
    clearCurrentItem: (state) => {
      state.currentItem = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch items
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch item by ID
      .addCase(fetchItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload.data;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
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
  clearCurrentItem
} = itemsSlice.actions;

// Selectors
export const selectItems = (state) => state.items.items;
export const selectCurrentItem = (state) => state.items.currentItem;
export const selectPagination = (state) => state.items.pagination;
export const selectFilters = (state) => state.items.filters;
export const selectLoading = (state) => state.items.loading;
export const selectError = (state) => state.items.error;

export default itemsSlice.reducer;
