import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import { store } from '../store';
import {
  fetchProducts,
  fetchProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  setLastLoadedProjectId,
  clearCurrentProduct,
  clearError,
  setCurrentProduct,
  selectProducts,
  selectCurrentProduct,
  selectProductsLoading,
  selectProductsError,
  selectProductsCreating,
  selectProductsUpdating,
  selectProductsDeleting,
  selectProductsPagination
} from '../store/slices/productsSlice';
import { useNotifications } from './useNotifications';

export const useProducts = () => {
  const dispatch = useDispatch();
  const { showLoading, hideLoading } = useLoading();
  const { toast } = useNotifications();
  
  const products = useSelector(selectProducts) || [];
  const currentProduct = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const creating = useSelector(selectProductsCreating);
  const updating = useSelector(selectProductsUpdating);
  const deleting = useSelector(selectProductsDeleting);
  const pagination = useSelector(selectProductsPagination);

  // Load products with caching
  const loadProducts = useCallback(async (filters = {}, forceReload = false) => {
    // Check cache to prevent duplicate requests
    const currentState = store.getState().products;
    const lastLoadedProjectId = currentState.lastLoadedProjectId;
    
    // Skip if already loaded for this project
    if (!forceReload && filters.projectId && 
        filters.projectId === lastLoadedProjectId && 
        currentState.products.length >= 0) {
      return currentState.products;
    }
    
    showLoading('products', 'Loading products...');
    try {
      const result = await dispatch(fetchProducts(filters)).unwrap();
      
      // Track which project was loaded
      if (filters.projectId) {
        dispatch(setLastLoadedProjectId(filters.projectId));
      }
      
      return result;
    } catch (error) {
      console.error('Failed to load products:', error);
      toast('Failed to load products', 'error');
      return null;
    } finally {
      hideLoading('products');
    }
  }, [dispatch, showLoading, hideLoading, toast]);

  // Load single product
  const loadProduct = useCallback(async (id, options = {}) => {
    showLoading('product', 'Loading product details...');
    try {
      const result = await dispatch(fetchProductById(id)).unwrap();
      return result;
    } catch (error) {
      console.error('Failed to load product:', error);
      toast('Failed to load product details', 'error');
      throw error;
    } finally {
      hideLoading('product');
    }
  }, [dispatch, showLoading, hideLoading, toast]);

  // Create product
  const createNewProduct = useCallback(async (data) => {
    showLoading('product', 'Creating product...');
    try {
      const result = await dispatch(createProduct(data)).unwrap();
      toast('Product created successfully', 'success');
      return result;
    } catch (error) {
      console.error('Failed to create product:', error);
      toast('Failed to create product', 'error');
      throw error;
    } finally {
      hideLoading('product');
    }
  }, [dispatch, showLoading, hideLoading, toast]);

  // Update product
  const updateExistingProduct = useCallback(async (id, updates) => {
    showLoading('product', 'Updating product...');
    try {
      const result = await dispatch(updateProduct({ id, updates })).unwrap();
      toast('Product updated successfully', 'success');
      return result;
    } catch (error) {
      console.error('Failed to update product:', error);
      toast('Failed to update product', 'error');
      throw error;
    } finally {
      hideLoading('product');
    }
  }, [dispatch, showLoading, hideLoading, toast]);

  // Delete product
  const removeProduct = useCallback(async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast('Product deleted successfully', 'success');
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast('Failed to delete product', 'error');
      throw error;
    }
  }, [dispatch, toast]);

  // Set current product
  const selectProduct = useCallback((product) => {
    dispatch(setCurrentProduct(product));
  }, [dispatch]);

  // Clear current product
  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentProduct());
  }, [dispatch]);

  // Clear errors
  const clearAllErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Get product by ID from loaded products
  const getProductById = useCallback((id) => {
    return products.find(p => p._id === id);
  }, [products]);

  // Get products for specific project
  const getProductsByProject = useCallback((projectId) => {
    return products.filter(p => p.projectId?._id === projectId);
  }, [products]);

  return {
    products,
    currentProduct,
    loading,
    error,
    creating,
    updating,
    deleting,
    pagination,
    loadProducts,
    loadProduct,
    createNewProduct,
    updateExistingProduct,
    removeProduct,
    selectProduct,
    clearCurrent,
    clearAllErrors,
    getProductById,
    getProductsByProject
  };
};