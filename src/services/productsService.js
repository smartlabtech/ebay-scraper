import api from './api';

// Track ongoing requests to prevent duplicates
const getProductsPromises = new Map();
const getProductByIdPromises = new Map();

// Products API Service
const productsService = {
  // Get all products with filters
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach(item => queryParams.append(`${key}[]`, item));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const queryString = queryParams.toString();
      const cacheKey = queryString || 'all';

      // Check if this request is already in progress
      if (getProductsPromises.has(cacheKey)) {
        console.log(`Products request with params "${cacheKey}" already in progress, reusing`);
        return getProductsPromises.get(cacheKey);
      }

      // Note: This uses the same endpoint as projectProducts service
      // The api service automatically adds /api/en prefix
      const url = queryString ? `/project-product?${queryString}` : '/project-product';
      console.log('Fetching products from:', url);

      // Create the request promise
      const promise = api.get(url)
        .then(response => {
          console.log('Products response:', response.data);
          return response.data;
        })
        .catch(error => {
          console.error('Error fetching products:', error);
          // Return empty data structure if API fails to prevent app crash
          if (error.response?.status === 404) {
            console.log('Products endpoint not found, returning empty array');
            return { data: [], total: 0, page: 1, size: 10 };
          }
          throw error;
        })
        .finally(() => {
          // Clean up after completion
          getProductsPromises.delete(cacheKey);
        });

      // Store the promise
      getProductsPromises.set(cacheKey, promise);

      return promise;
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  // Get product by ID
  getById: async (id, options = {}) => {
    try {
      const queryParams = new URLSearchParams();

      if (options.includeProject) queryParams.append('includeProject', 'true');
      if (options.includeBrandMessages) queryParams.append('includeBrandMessages', 'true');

      const queryString = queryParams.toString();
      const cacheKey = `${id}_${queryString}`;

      // Check if this product is already being fetched
      if (getProductByIdPromises.has(cacheKey)) {
        console.log(`Product ${id} with options "${queryString}" already being fetched, reusing`);
        return getProductByIdPromises.get(cacheKey);
      }

      const url = queryString ? `/project-product/${id}?${queryString}` : `/project-product/${id}`;

      // Create the request promise
      const promise = api.get(url)
        .then(response => response.data)
        .finally(() => {
          // Clean up after completion
          getProductByIdPromises.delete(cacheKey);
        });

      // Store the promise
      getProductByIdPromises.set(cacheKey, promise);

      return promise;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create new product
  create: async (data) => {
    try {
      const response = await api.post('/project-product', data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  update: async (id, updates) => {
    try {
      const response = await api.patch(`/project-product/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product (soft delete)
  delete: async (id) => {
    try {
      const response = await api.delete(`/project-product/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Get product statistics
  getStatistics: async (projectId) => {
    try {
      const response = await api.get(`/project-product/statistics?projectId=${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product statistics:', error);
      throw error;
    }
  }
};

export default productsService;