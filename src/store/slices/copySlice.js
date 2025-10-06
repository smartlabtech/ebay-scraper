import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import copyService, { COPY_STATUS } from '../../services/copyService';

export const generateCopy = createAsyncThunk(
  'copy/generate',
  async (data, { rejectWithValue }) => {
    try {
      const response = await copyService.generate(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to generate copy');
    }
  }
);

export const fetchAllCopies = createAsyncThunk(
  'copy/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await copyService.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch copies');
    }
  }
);

export const fetchCopyById = createAsyncThunk(
  'copy/fetchById',
  async ({ id, options = {} }, { rejectWithValue }) => {
    try {
      const response = await copyService.getById(id, options);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch copy');
    }
  }
);

export const deleteCopy = createAsyncThunk(
  'copy/delete',
  async (id, { rejectWithValue }) => {
    try {
      await copyService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete copy');
    }
  }
);

export const fetchCopyStatistics = createAsyncThunk(
  'copy/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await copyService.getStatistics();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch statistics');
    }
  }
);

const initialState = {
  copies: [],
  currentCopy: null,
  statistics: null,
  filters: {
    platform: '',
    platforms: [],
    copyType: '',
    copyTypes: [],
    status: '',
    projectId: '',
    brandMessageId: '',
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    orderBy: 'createdAt',
    sortType: 'DESCENDING'
  },
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    currentPage: 1
  },
  loading: {
    generate: false,
    fetch: false,
    delete: false,
    statistics: false
  },
  error: {
    generate: null,
    fetch: null,
    delete: null,
    statistics: null
  },
  generationHistory: [],
  selectedVariations: [],
  creditBalance: 100,
  estimatedCost: 0
};

const copySlice = createSlice({
  name: 'copy',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.offset = 0;
      state.pagination.currentPage = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination = initialState.pagination;
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
      state.pagination.offset = (action.payload - 1) * state.pagination.limit;
    },
    selectVariation: (state, action) => {
      const { copyId, variationIndex } = action.payload;
      const existing = state.selectedVariations.findIndex(
        v => v.copyId === copyId && v.variationIndex === variationIndex
      );
      
      if (existing > -1) {
        state.selectedVariations.splice(existing, 1);
      } else {
        state.selectedVariations.push(action.payload);
      }
    },
    clearSelectedVariations: (state) => {
      state.selectedVariations = [];
    },
    addToHistory: (state, action) => {
      state.generationHistory.unshift({
        ...action.payload,
        timestamp: new Date().toISOString()
      });
      if (state.generationHistory.length > 50) {
        state.generationHistory.pop();
      }
    },
    updateCopyStatus: (state, action) => {
      const { id, status } = action.payload;
      const copy = state.copies.find(c => c._id === id);
      if (copy) {
        copy.status = status;
      }
      if (state.currentCopy && state.currentCopy._id === id) {
        state.currentCopy.status = status;
      }
    },
    setEstimatedCost: (state, action) => {
      state.estimatedCost = action.payload;
    },
    updateCreditBalance: (state, action) => {
      state.creditBalance = action.payload;
    },
    clearCurrentCopy: (state) => {
      state.currentCopy = null;
    },
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    updateCopyLocally: (state, action) => {
      const { id, updates } = action.payload;
      const copyIndex = state.copies.findIndex(c => c._id === id);
      if (copyIndex > -1) {
        state.copies[copyIndex] = { ...state.copies[copyIndex], ...updates };
      }
      if (state.currentCopy && state.currentCopy._id === id) {
        state.currentCopy = { ...state.currentCopy, ...updates };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateCopy.pending, (state) => {
        state.loading.generate = true;
        state.error.generate = null;
      })
      .addCase(generateCopy.fulfilled, (state, action) => {
        state.loading.generate = false;
        state.copies.unshift(action.payload);
        state.currentCopy = action.payload;
        state.generationHistory.unshift({
          ...action.payload,
          timestamp: new Date().toISOString()
        });
        const tokensUsed = action.payload.totalTokensUsed;
        const creditsUsed = Math.ceil(tokensUsed / 1000);
        state.creditBalance = Math.max(0, state.creditBalance - creditsUsed);
      })
      .addCase(generateCopy.rejected, (state, action) => {
        state.loading.generate = false;
        state.error.generate = action.payload;
      })
      .addCase(fetchAllCopies.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchAllCopies.fulfilled, (state, action) => {
        state.loading.fetch = false;
        // Handle both array response and object with data property
        if (Array.isArray(action.payload)) {
          state.copies = action.payload;
          state.pagination.total = action.payload.length;
        } else if (action.payload?.data) {
          state.copies = action.payload.data;
          state.pagination.total = action.payload.total || action.payload.data.length;
        } else {
          state.copies = [];
          state.pagination.total = 0;
        }
      })
      .addCase(fetchAllCopies.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      })
      .addCase(fetchCopyById.pending, (state) => {
        state.loading.fetch = true;
        state.error.fetch = null;
      })
      .addCase(fetchCopyById.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.currentCopy = action.payload;
      })
      .addCase(fetchCopyById.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error.fetch = action.payload;
      })
      .addCase(deleteCopy.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteCopy.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.copies = state.copies.filter(c => c._id !== action.payload);
        if (state.currentCopy && state.currentCopy._id === action.payload) {
          state.currentCopy = null;
        }
      })
      .addCase(deleteCopy.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      })
      .addCase(fetchCopyStatistics.pending, (state) => {
        state.loading.statistics = true;
        state.error.statistics = null;
      })
      .addCase(fetchCopyStatistics.fulfilled, (state, action) => {
        state.loading.statistics = false;
        state.statistics = action.payload;
      })
      .addCase(fetchCopyStatistics.rejected, (state, action) => {
        state.loading.statistics = false;
        state.error.statistics = action.payload;
      });
  }
});

export const {
  setFilters,
  clearFilters,
  setPagination,
  setCurrentPage,
  selectVariation,
  clearSelectedVariations,
  addToHistory,
  updateCopyStatus,
  setEstimatedCost,
  updateCreditBalance,
  clearCurrentCopy,
  clearErrors,
  updateCopyLocally
} = copySlice.actions;

export const selectCopies = (state) => state.copy.copies;
export const selectCurrentCopy = (state) => state.copy.currentCopy;
export const selectStatistics = (state) => state.copy.statistics;
export const selectFilters = (state) => state.copy.filters;
export const selectPagination = (state) => state.copy.pagination;
export const selectLoading = (state) => state.copy.loading;
export const selectError = (state) => state.copy.error;
export const selectGenerationHistory = (state) => state.copy.generationHistory;
export const selectSelectedVariations = (state) => state.copy.selectedVariations;
export const selectCreditBalance = (state) => state.copy.creditBalance;
export const selectEstimatedCost = (state) => state.copy.estimatedCost;

export const selectFilteredCopies = (state) => {
  const { copies, filters } = state.copy;
  let filtered = [...copies];

  if (filters.status && filters.status !== 'ALL') {
    filtered = filtered.filter(c => c.status === filters.status);
  }

  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(c =>
      c.productName?.toLowerCase().includes(term) ||
      c.generatedCopies?.some(gc => 
        gc.content?.fullCopy?.toLowerCase().includes(term) ||
        gc.content?.hook?.toLowerCase().includes(term)
      )
    );
  }

  return filtered;
};

export const selectTotalPages = (state) => {
  const { total, limit } = state.copy.pagination;
  return Math.ceil(total / limit);
};

export default copySlice.reducer;