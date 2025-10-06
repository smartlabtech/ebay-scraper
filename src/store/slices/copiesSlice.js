import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import copyService from '../../services/copyService';

// Async thunks
export const fetchCopies = createAsyncThunk(
  'copies/fetchCopies',
  async (filters = {}) => {
    const response = await copyService.getAll(filters);
    // The API returns the data in the correct format
    return response;
  }
);

export const fetchCopyById = createAsyncThunk(
  'copies/fetchCopyById',
  async (copyId) => {
    const response = await copyService.getById(copyId);
    return response;
  }
);

export const createCopy = createAsyncThunk(
  'copies/createCopy',
  async (copyData) => {
    // Use generate since there's no create method
    const response = await copyService.generate(copyData);
    return response;
  }
);

export const updateCopy = createAsyncThunk(
  'copies/updateCopy', 
  async ({ copyId, updates }) => {
    // No update method in service, return dummy for now
    return { ...updates, id: copyId };
  }
);

export const deleteCopy = createAsyncThunk(
  'copies/deleteCopy',
  async (copyId) => {
    await copyService.delete(copyId);
    return copyId;
  }
);

export const generateCopy = createAsyncThunk(
  'copies/generateCopy',
  async (params) => {
    const response = await copyService.generate(params);
    return response;
  }
);

export const adaptCopy = createAsyncThunk(
  'copies/adaptCopy',
  async ({ messageId, platform, format }) => {
    // No adapt method in service, use generate with modified params
    const response = await copyService.generate({ messageId, platform, format });
    return response;
  }
);

export const updatePerformance = createAsyncThunk(
  'copies/updatePerformance',
  async ({ copyId, metrics }) => {
    // No updatePerformance method in service
    return { copyId, performance: metrics };
  }
);

export const generateHashtags = createAsyncThunk(
  'copies/generateHashtags',
  async ({ copyId, count }) => {
    // No generateHashtags method in service
    return { copyId, hashtags: [] };
  }
);

// Initial state
const initialState = {
  copies: [],
  currentCopy: null,
  generatedCopy: null,
  adaptedCopies: [],
  loading: false,
  generateLoading: false,
  error: null,
  lastLoadedProjectId: null,
  filters: {
    projectId: null,
    platform: 'all',
    format: 'all',
    status: 'all',
    sortBy: 'createdAt',
    search: ''
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0
  }
};

// Copies slice
const copiesSlice = createSlice({
  name: 'copies',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLastLoadedProjectId: (state, action) => {
      state.lastLoadedProjectId = action.payload;
    },
    clearCurrentCopy: (state) => {
      state.currentCopy = null;
    },
    clearGeneratedCopy: (state) => {
      state.generatedCopy = null;
    },
    clearAdaptedCopies: (state) => {
      state.adaptedCopies = [];
    },
    clearError: (state) => {
      state.error = null;
    },
    updateCopyStatus: (state, action) => {
      const { copyId, status } = action.payload;
      const copy = state.copies.find(c => c.id === copyId);
      if (copy) {
        copy.status = status;
      }
      if (state.currentCopy?.id === copyId) {
        state.currentCopy.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch copies
    builder
      .addCase(fetchCopies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCopies.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both array and object with copies property
        if (Array.isArray(action.payload)) {
          state.copies = action.payload;
          state.pagination = {
            page: 1,
            limit: 20,
            total: action.payload.length
          };
        } else {
          state.copies = action.payload.copies || action.payload.data || [];
          state.pagination = {
            page: action.payload.page || 1,
            limit: action.payload.limit || 20,
            total: action.payload.total || (action.payload.copies ? action.payload.copies.length : 0)
          };
        }
      })
      .addCase(fetchCopies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch copies';
      });

    // Fetch copy by ID
    builder
      .addCase(fetchCopyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCopyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCopy = action.payload;
      })
      .addCase(fetchCopyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch copy';
      });

    // Create copy
    builder
      .addCase(createCopy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCopy.fulfilled, (state, action) => {
        state.loading = false;
        state.copies.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createCopy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create copy';
      });

    // Update copy
    builder
      .addCase(updateCopy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCopy.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.copies.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.copies[index] = action.payload;
        }
        if (state.currentCopy?.id === action.payload.id) {
          state.currentCopy = action.payload;
        }
      })
      .addCase(updateCopy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update copy';
      });

    // Delete copy
    builder
      .addCase(deleteCopy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCopy.fulfilled, (state, action) => {
        state.loading = false;
        state.copies = state.copies.filter(c => c.id !== action.payload);
        if (state.currentCopy?.id === action.payload) {
          state.currentCopy = null;
        }
        state.pagination.total -= 1;
      })
      .addCase(deleteCopy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete copy';
      });

    // Generate copy
    builder
      .addCase(generateCopy.pending, (state) => {
        state.generateLoading = true;
        state.error = null;
        state.generatedCopy = null;
      })
      .addCase(generateCopy.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.generatedCopy = action.payload;
      })
      .addCase(generateCopy.rejected, (state, action) => {
        state.generateLoading = false;
        state.error = action.error.message || 'Failed to generate copy';
      });

    // Adapt copy
    builder
      .addCase(adaptCopy.pending, (state) => {
        state.generateLoading = true;
        state.error = null;
      })
      .addCase(adaptCopy.fulfilled, (state, action) => {
        state.generateLoading = false;
        state.adaptedCopies.push(action.payload);
      })
      .addCase(adaptCopy.rejected, (state, action) => {
        state.generateLoading = false;
        state.error = action.error.message || 'Failed to adapt copy';
      });

    // Update performance
    builder
      .addCase(updatePerformance.fulfilled, (state, action) => {
        const { copyId, performance } = action.payload;
        const copy = state.copies.find(c => c.id === copyId);
        if (copy) {
          copy.performance = performance;
        }
        if (state.currentCopy?.id === copyId) {
          state.currentCopy.performance = performance;
        }
      });

    // Generate hashtags
    builder
      .addCase(generateHashtags.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateHashtags.fulfilled, (state, action) => {
        state.loading = false;
        const { copyId, hashtags } = action.payload;
        const copy = state.copies.find(c => c.id === copyId);
        if (copy) {
          copy.hashtags = hashtags;
        }
        if (state.currentCopy?.id === copyId) {
          state.currentCopy.hashtags = hashtags;
        }
      })
      .addCase(generateHashtags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate hashtags';
      });
  }
});

// Export actions
export const { 
  setFilters, 
  setLastLoadedProjectId,
  clearCurrentCopy, 
  clearGeneratedCopy,
  clearAdaptedCopies,
  clearError,
  updateCopyStatus 
} = copiesSlice.actions;

// Export selectors
export const selectCopies = (state) => state.copies.copies;
export const selectCurrentCopy = (state) => state.copies.currentCopy;
export const selectGeneratedCopy = (state) => state.copies.generatedCopy;
export const selectAdaptedCopies = (state) => state.copies.adaptedCopies;
export const selectCopiesLoading = (state) => state.copies.loading;
export const selectGenerateLoading = (state) => state.copies.generateLoading;
export const selectCopiesError = (state) => state.copies.error;
export const selectCopyFilters = (state) => state.copies.filters;
export const selectCopiesPagination = (state) => state.copies.pagination;

// Export reducer
export default copiesSlice.reducer;