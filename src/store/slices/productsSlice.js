import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productsService from '../../services/productsService';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}) => {
    const response = await productsService.getAll(filters);
    return response;
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await productsService.getById(id);
    return response;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data) => {
    const response = await productsService.create(data);
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, updates }) => {
    const response = await productsService.update(id, updates);
    return response;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    await productsService.delete(id);
    return id;
  }
);

// Initial state
const initialState = {
  products: [],
  currentProduct: null,
  lastLoadedProjectId: null,
  loading: false,
  error: null,
  creating: false,
  updating: false,
  deleting: false,
  pagination: {
    page: 1,
    size: 10,
    total: 0,
    totalPages: 1
  }
};

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setLastLoadedProjectId: (state, action) => {
      state.lastLoadedProjectId = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Fetch products
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Handle the response structure from API
        if (action.payload.data) {
          state.products = action.payload.data;
          state.pagination = {
            page: action.payload.page || 1,
            size: action.payload.size || 10,
            total: action.payload.total || 0,
            totalPages: Math.ceil((action.payload.total || 0) / (action.payload.size || 10))
          };
        } else if (Array.isArray(action.payload)) {
          state.products = action.payload;
          state.pagination = {
            page: 1,
            size: 10,
            total: action.payload.length,
            totalPages: 1
          };
        } else {
          state.products = [];
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      });

    // Fetch product by ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.creating = false;
        state.products.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.creating = false;
        state.error = action.error.message || 'Failed to create product';
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct && state.currentProduct._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updating = false;
        state.error = action.error.message || 'Failed to update product';
      });

    // Delete product
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleting = false;
        state.products = state.products.filter(p => p._id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
        if (state.currentProduct && state.currentProduct._id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.error.message || 'Failed to delete product';
      });
  }
});

// Export actions
export const { 
  setLastLoadedProjectId,
  clearCurrentProduct,
  clearError,
  setCurrentProduct
} = productsSlice.actions;

// Export selectors
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectProductsCreating = (state) => state.products.creating;
export const selectProductsUpdating = (state) => state.products.updating;
export const selectProductsDeleting = (state) => state.products.deleting;
export const selectProductsPagination = (state) => state.products.pagination;

export default productsSlice.reducer;