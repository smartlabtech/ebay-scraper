import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import ordersService from '../../services/orders';
import paymentService from '../../services/payment';

// Initial state
const initialState = {
  pendingOrders: [],
  currentOrder: null,
  loading: {
    initiate: false,
    pending: false,
    cancel: false,
    retry: false,
    status: false,
    checkout: false
  },
  error: {
    initiate: null,
    pending: null,
    cancel: null,
    retry: null,
    status: null,
    checkout: null
  },
  lastUpdated: null
};

// Async thunks

// Initiate subscription
export const initiateSubscription = createAsyncThunk(
  'orders/initiateSubscription',
  async (planId, { rejectWithValue }) => {
    try {
      const response = await ordersService.initiateSubscription(planId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch pending orders
export const fetchPendingOrders = createAsyncThunk(
  'orders/fetchPendingOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ordersService.getPendingOrders();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get order by ID
export const fetchOrderById = createAsyncThunk(
  'orders/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersService.getOrderById(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersService.cancelOrder(orderId);
      return { orderId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Retry payment
export const retryPayment = createAsyncThunk(
  'orders/retryPayment',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersService.retryPayment(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Check order status
export const checkOrderStatus = createAsyncThunk(
  'orders/checkOrderStatus',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersService.checkOrderStatus(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create payment checkout
export const createPaymentCheckout = createAsyncThunk(
  'orders/createPaymentCheckout',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await paymentService.createCheckout(orderId);
      return { orderId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    // Clear specific error
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.error[errorType]) {
        state.error[errorType] = null;
      }
    },
    
    // Clear all errors
    clearAllErrors: (state) => {
      state.error = {
        initiate: null,
        pending: null,
        cancel: null,
        retry: null,
        status: null,
        checkout: null
      };
    },
    
    // Update order in pending orders list
    updatePendingOrder: (state, action) => {
      const { orderId, updates } = action.payload;
      const orderIndex = state.pendingOrders.findIndex(order => order.orderId === orderId);
      if (orderIndex !== -1) {
        state.pendingOrders[orderIndex] = { ...state.pendingOrders[orderIndex], ...updates };
      }
    },
    
    // Remove order from pending orders
    removePendingOrder: (state, action) => {
      const orderId = action.payload;
      state.pendingOrders = state.pendingOrders.filter(order => order.orderId !== orderId);
    },
    
    // Reset orders state
    resetOrdersState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Initiate subscription
      .addCase(initiateSubscription.pending, (state) => {
        state.loading.initiate = true;
        state.error.initiate = null;
      })
      .addCase(initiateSubscription.fulfilled, (state, action) => {
        state.loading.initiate = false;
        state.currentOrder = action.payload;
        state.lastUpdated = new Date().toISOString();
        
        // Add to pending orders if not already there
        const existingOrderIndex = state.pendingOrders.findIndex(
          order => order.orderId === action.payload.orderId
        );
        if (existingOrderIndex === -1) {
          state.pendingOrders.unshift(action.payload);
        } else {
          state.pendingOrders[existingOrderIndex] = action.payload;
        }
      })
      .addCase(initiateSubscription.rejected, (state, action) => {
        state.loading.initiate = false;
        state.error.initiate = action.payload;
      })
      
      // Fetch pending orders
      .addCase(fetchPendingOrders.pending, (state) => {
        state.loading.pending = true;
        state.error.pending = null;
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action) => {
        state.loading.pending = false;
        state.pendingOrders = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.loading.pending = false;
        state.error.pending = action.payload;
      })
      
      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading.status = true;
        state.error.status = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading.status = false;
        state.currentOrder = action.payload;
        
        // Update in pending orders if it exists
        const orderIndex = state.pendingOrders.findIndex(
          order => order.orderId === action.payload.orderId
        );
        if (orderIndex !== -1) {
          state.pendingOrders[orderIndex] = action.payload;
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading.status = false;
        state.error.status = action.payload;
      })
      
      // Cancel order
      .addCase(cancelOrder.pending, (state) => {
        state.loading.cancel = true;
        state.error.cancel = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading.cancel = false;
        const { orderId } = action.payload;
        
        // Remove from pending orders
        state.pendingOrders = state.pendingOrders.filter(order => order.orderId !== orderId);
        
        // Clear current order if it's the cancelled one
        if (state.currentOrder?.orderId === orderId) {
          state.currentOrder = null;
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading.cancel = false;
        state.error.cancel = action.payload;
      })
      
      // Retry payment
      .addCase(retryPayment.pending, (state) => {
        state.loading.retry = true;
        state.error.retry = null;
      })
      .addCase(retryPayment.fulfilled, (state, action) => {
        state.loading.retry = false;
        const updatedOrder = action.payload;
        
        // Update current order
        if (state.currentOrder?.orderId === updatedOrder.orderId) {
          state.currentOrder = { ...state.currentOrder, ...updatedOrder };
        }
        
        // Update in pending orders
        const orderIndex = state.pendingOrders.findIndex(
          order => order.orderId === updatedOrder.orderId
        );
        if (orderIndex !== -1) {
          state.pendingOrders[orderIndex] = { ...state.pendingOrders[orderIndex], ...updatedOrder };
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(retryPayment.rejected, (state, action) => {
        state.loading.retry = false;
        state.error.retry = action.payload;
      })
      
      // Check order status
      .addCase(checkOrderStatus.pending, (state) => {
        state.loading.status = true;
        state.error.status = null;
      })
      .addCase(checkOrderStatus.fulfilled, (state, action) => {
        state.loading.status = false;
        const statusUpdate = action.payload;
        
        // Update current order status
        if (state.currentOrder?.orderId === statusUpdate.orderId) {
          state.currentOrder = { ...state.currentOrder, ...statusUpdate };
        }
        
        // Update in pending orders
        const orderIndex = state.pendingOrders.findIndex(
          order => order.orderId === statusUpdate.orderId
        );
        if (orderIndex !== -1) {
          state.pendingOrders[orderIndex] = { ...state.pendingOrders[orderIndex], ...statusUpdate };
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(checkOrderStatus.rejected, (state, action) => {
        state.loading.status = false;
        state.error.status = action.payload;
      })
      
      // Create payment checkout
      .addCase(createPaymentCheckout.pending, (state) => {
        state.loading.checkout = true;
        state.error.checkout = null;
      })
      .addCase(createPaymentCheckout.fulfilled, (state, action) => {
        state.loading.checkout = false;
        const checkoutUpdate = action.payload;
        
        // Update current order with checkout details
        if (state.currentOrder?.orderId === checkoutUpdate.orderId) {
          state.currentOrder = { ...state.currentOrder, ...checkoutUpdate };
        }
        
        // Update in pending orders
        const orderIndex = state.pendingOrders.findIndex(
          order => order.orderId === checkoutUpdate.orderId
        );
        if (orderIndex !== -1) {
          state.pendingOrders[orderIndex] = { ...state.pendingOrders[orderIndex], ...checkoutUpdate };
        }
        
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(createPaymentCheckout.rejected, (state, action) => {
        state.loading.checkout = false;
        state.error.checkout = action.payload;
      });
  }
});

// Export actions
export const {
  clearCurrentOrder,
  clearError,
  clearAllErrors,
  updatePendingOrder,
  removePendingOrder,
  resetOrdersState
} = ordersSlice.actions;

// Selectors
export const selectPendingOrders = (state) => state.orders.pendingOrders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
export const selectLastUpdated = (state) => state.orders.lastUpdated;

// Computed selectors
export const selectHasPendingOrders = (state) => state.orders.pendingOrders.length > 0;
export const selectIsInitiatingOrder = (state) => state.orders.loading.initiate;
export const selectIsFetchingPendingOrders = (state) => state.orders.loading.pending;

// Memoized selector for error messages to prevent unnecessary re-renders
export const selectOrdersErrorMessages = createSelector(
  [(state) => state.orders.error],
  (errors) => {
    // Return the same array reference if no errors
    const errorList = Object.values(errors).filter(error => error !== null);
    return errorList.length > 0 ? errorList : [];
  }
);

// Get order by ID from pending orders
export const selectOrderById = (orderId) => (state) => 
  state.orders.pendingOrders.find(order => order.orderId === orderId);

// Get expired orders - memoized
export const selectExpiredOrders = createSelector(
  [selectPendingOrders],
  (pendingOrders) => {
    const now = new Date();
    return pendingOrders.filter(order => 
      order.expiresAt && new Date(order.expiresAt) < now
    );
  }
);

// Get orders expiring soon (within 1 hour) - memoized
export const selectOrdersExpiringSoon = createSelector(
  [selectPendingOrders],
  (pendingOrders) => {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    return pendingOrders.filter(order => 
      order.expiresAt && 
      new Date(order.expiresAt) > now && 
      new Date(order.expiresAt) <= oneHourFromNow
    );
  }
);

// Export reducer
export default ordersSlice.reducer;