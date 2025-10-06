import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import writingStylesApi from '../../services/writingStyles';

// Async thunks
export const fetchWritingStyles = createAsyncThunk(
  'writingStyles/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await writingStylesApi.getAll(params);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch writing styles';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchWritingStyleById = createAsyncThunk(
  'writingStyles/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await writingStylesApi.getById(id);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch writing style';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createWritingStyle = createAsyncThunk(
  'writingStyles/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await writingStylesApi.create(data);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create writing style';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateWritingStyle = createAsyncThunk(
  'writingStyles/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await writingStylesApi.update(id, data);
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update writing style';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteWritingStyle = createAsyncThunk(
  'writingStyles/delete',
  async (id, { rejectWithValue }) => {
    try {
      await writingStylesApi.delete(id);
      return id;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to delete writing style';
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial state
const initialState = {
  styles: [],
  currentStyle: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10
  },
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false
};

// Slice
const writingStylesSlice = createSlice({
  name: 'writingStyles',
  initialState,
  reducers: {
    clearCurrentStyle: (state) => {
      state.currentStyle = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentStyle: (state, action) => {
      state.currentStyle = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all writing styles
      .addCase(fetchWritingStyles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWritingStyles.fulfilled, (state, action) => {
        state.loading = false;
        state.styles = action.payload.data || [];
        state.pagination = {
          total: action.payload.total || 0,
          page: parseInt(action.payload.page) || 1,
          limit: parseInt(action.payload.limit) || 10
        };
      })
      .addCase(fetchWritingStyles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch writing style by ID
      .addCase(fetchWritingStyleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWritingStyleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStyle = action.payload;
      })
      .addCase(fetchWritingStyleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create writing style
      .addCase(createWritingStyle.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createWritingStyle.fulfilled, (state, action) => {
        state.creating = false;
        state.styles.unshift(action.payload);
        state.currentStyle = action.payload;
      })
      .addCase(createWritingStyle.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      // Update writing style
      .addCase(updateWritingStyle.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateWritingStyle.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.styles.findIndex(s => s._id === action.payload._id);
        if (index !== -1) {
          state.styles[index] = action.payload;
        }
        if (state.currentStyle?._id === action.payload._id) {
          state.currentStyle = action.payload;
        }
      })
      .addCase(updateWritingStyle.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Delete writing style
      .addCase(deleteWritingStyle.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteWritingStyle.fulfilled, (state, action) => {
        state.deleting = false;
        state.styles = state.styles.filter(s => s._id !== action.payload);
        if (state.currentStyle?._id === action.payload) {
          state.currentStyle = null;
        }
      })
      .addCase(deleteWritingStyle.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  }
});

// Actions
export const { clearCurrentStyle, clearError, setCurrentStyle } = writingStylesSlice.actions;

// Selectors
export const selectWritingStyles = (state) => state.writingStyles.styles;
export const selectCurrentStyle = (state) => state.writingStyles.currentStyle;
export const selectWritingStylesPagination = (state) => state.writingStyles.pagination;
export const selectWritingStylesLoading = (state) => state.writingStyles.loading;
export const selectWritingStylesError = (state) => state.writingStyles.error;
export const selectWritingStylesCreating = (state) => state.writingStyles.creating;
export const selectWritingStylesUpdating = (state) => state.writingStyles.updating;
export const selectWritingStylesDeleting = (state) => state.writingStyles.deleting;

export default writingStylesSlice.reducer;