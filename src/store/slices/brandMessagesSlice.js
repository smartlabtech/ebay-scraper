import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import brandMessagesApi from '../../services/brandMessages';

// Async thunks
export const fetchBrandMessages = createAsyncThunk(
  'brandMessages/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await brandMessagesApi.getAll(params);
      return response;
    } catch (error) {
      // Extract the message string from the error response
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch brand messages';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchBrandMessageById = createAsyncThunk(
  'brandMessages/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await brandMessagesApi.getById(id);
      return response;
    } catch (error) {
      // Extract the message string from the error response
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to fetch brand message';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createBrandMessage = createAsyncThunk(
  'brandMessages/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await brandMessagesApi.create(data);
      return response;
    } catch (error) {
      // Extract the message string from the error response
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to create brand message';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteBrandMessage = createAsyncThunk(
  'brandMessages/delete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await brandMessagesApi.delete(id);
      return { id, data: response };
    } catch (error) {
      // Extract the message string from the error response
      const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Failed to delete brand message';
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial state
const initialState = {
  messages: [],
  currentMessage: null,
  lastLoadedProjectId: null,
  pagination: {
    total: 0,
    page: 1,
    size: 10,
    totalPages: 1
  },
  loading: false,
  error: null,
  creating: false,
  deleting: false
};

// Slice
const brandMessagesSlice = createSlice({
  name: 'brandMessages',
  initialState,
  reducers: {
    setLastLoadedProjectId: (state, action) => {
      state.lastLoadedProjectId = action.payload;
    },
    clearCurrentMessage: (state) => {
      state.currentMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all brand messages
      .addCase(fetchBrandMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.data || [];
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchBrandMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch brand message by ID
      .addCase(fetchBrandMessageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrandMessageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMessage = action.payload;
      })
      .addCase(fetchBrandMessageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create brand message
      .addCase(createBrandMessage.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createBrandMessage.fulfilled, (state, action) => {
        state.creating = false;
        state.currentMessage = action.payload.brandMessage;
      })
      .addCase(createBrandMessage.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      // Delete brand message
      .addCase(deleteBrandMessage.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteBrandMessage.fulfilled, (state, action) => {
        state.deleting = false;
        // Remove the message from the list
        state.messages = state.messages.filter(m => m._id !== action.meta.arg);
        // Clear current message if it was the deleted one
        if (state.currentMessage && state.currentMessage._id === action.meta.arg) {
          state.currentMessage = null;
        }
      })
      .addCase(deleteBrandMessage.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  }
});

// Actions
export const { setLastLoadedProjectId, clearCurrentMessage, clearError } = brandMessagesSlice.actions;

// Selectors
export const selectBrandMessages = (state) => state.brandMessages.messages;
export const selectCurrentMessage = (state) => state.brandMessages.currentMessage;
export const selectBrandMessagesPagination = (state) => state.brandMessages.pagination;
export const selectBrandMessagesLoading = (state) => state.brandMessages.loading;
export const selectBrandMessagesError = (state) => state.brandMessages.error;
export const selectBrandMessagesCreating = (state) => state.brandMessages.creating;
export const selectBrandMessagesDeleting = (state) => state.brandMessages.deleting;

export default brandMessagesSlice.reducer;