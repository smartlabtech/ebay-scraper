import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import brandMessagesApi from '../../services/brandMessages';

// Async thunks
export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (filters) => {
    const response = await brandMessagesApi.getAll(filters);
    return response;
  }
);

export const fetchMessageById = createAsyncThunk(
  'messages/fetchMessageById',
  async (messageId) => {
    const response = await brandMessagesApi.getById(messageId);
    return response;
  }
);

export const createMessage = createAsyncThunk(
  'messages/createMessage',
  async (messageData) => {
    const response = await brandMessagesApi.create(messageData);
    return response;
  }
);

export const updateMessage = createAsyncThunk(
  'messages/updateMessage',
  async ({ messageId, updates }) => {
    const response = await brandMessagesApi.update(messageId, updates);
    return response;
  }
);

export const deleteMessage = createAsyncThunk(
  'messages/deleteMessage',
  async (messageId) => {
    await brandMessagesApi.delete(messageId);
    return messageId;
  }
);

export const generateAIMessage = createAsyncThunk(
  'messages/generateAIMessage',
  async (params) => {
    const response = await brandMessagesApi.generateAI(params);
    return response;
  }
);

export const testMessage = createAsyncThunk(
  'messages/testMessage',
  async (messageId) => {
    const response = await brandMessagesApi.test(messageId);
    return { messageId, testResults: response };
  }
);

export const createVariant = createAsyncThunk(
  'messages/createVariant',
  async ({ messageId, variant }) => {
    const response = await brandMessagesApi.createVariant(messageId, variant);
    return { messageId, variant: response };
  }
);

// Initial state
const initialState = {
  messages: [],
  currentMessage: null,
  aiGeneratedMessage: null,
  loading: false,
  aiLoading: false,
  error: null,
  filters: {
    projectId: null,
    type: '',
    status: '',
    sortBy: 'createdAt',
    search: ''
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0
  }
};

// Messages slice
const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentMessage: (state) => {
      state.currentMessage = null;
    },
    clearAIGeneratedMessage: (state) => {
      state.aiGeneratedMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateMessageScore: (state, action) => {
      const { messageId, score } = action.payload;
      const message = state.messages.find(m => m.id === messageId);
      if (message) {
        message.score = score;
      }
      if (state.currentMessage?.id === messageId) {
        state.currentMessage.score = score;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch messages
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total
        };
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      });

    // Fetch message by ID
    builder
      .addCase(fetchMessageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessageById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMessage = action.payload;
      })
      .addCase(fetchMessageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch message';
      });

    // Create message
    builder
      .addCase(createMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create message';
      });

    // Update message
    builder
      .addCase(updateMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMessage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.messages.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.messages[index] = action.payload;
        }
        if (state.currentMessage?.id === action.payload.id) {
          state.currentMessage = action.payload;
        }
      })
      .addCase(updateMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update message';
      });

    // Delete message
    builder
      .addCase(deleteMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = state.messages.filter(m => m.id !== action.payload);
        if (state.currentMessage?.id === action.payload) {
          state.currentMessage = null;
        }
        state.pagination.total -= 1;
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete message';
      });

    // Generate AI message
    builder
      .addCase(generateAIMessage.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
        state.aiGeneratedMessage = null;
      })
      .addCase(generateAIMessage.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.aiGeneratedMessage = action.payload;
      })
      .addCase(generateAIMessage.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = action.error.message || 'Failed to generate AI message';
      });

    // Test message
    builder
      .addCase(testMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(testMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { messageId, testResults } = action.payload;
        const message = state.messages.find(m => m.id === messageId);
        if (message) {
          message.testResults = testResults;
          message.status = 'testing';
        }
        if (state.currentMessage?.id === messageId) {
          state.currentMessage.testResults = testResults;
          state.currentMessage.status = 'testing';
        }
      })
      .addCase(testMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to test message';
      });

    // Create variant
    builder
      .addCase(createVariant.fulfilled, (state, action) => {
        const { messageId, variant } = action.payload;
        const message = state.messages.find(m => m.id === messageId);
        if (message) {
          if (!message.variants) message.variants = [];
          message.variants.push(variant);
        }
        if (state.currentMessage?.id === messageId) {
          if (!state.currentMessage.variants) state.currentMessage.variants = [];
          state.currentMessage.variants.push(variant);
        }
      });
  }
});

// Export actions
export const { 
  setFilters, 
  clearCurrentMessage, 
  clearAIGeneratedMessage, 
  clearError,
  updateMessageScore 
} = messagesSlice.actions;

// Export selectors
export const selectMessages = (state) => state.messages.messages;
export const selectCurrentMessage = (state) => state.messages.currentMessage;
export const selectAIGeneratedMessage = (state) => state.messages.aiGeneratedMessage;
export const selectMessagesLoading = (state) => state.messages.loading;
export const selectAILoading = (state) => state.messages.aiLoading;
export const selectMessagesError = (state) => state.messages.error;
export const selectMessageFilters = (state) => state.messages.filters;
export const selectMessagesPagination = (state) => state.messages.pagination;

// Export reducer
export default messagesSlice.reducer;