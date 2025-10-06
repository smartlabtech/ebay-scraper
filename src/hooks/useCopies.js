import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import { store } from '../store';
import {
  fetchCopies,
  fetchCopyById,
  generateCopy,
  deleteCopy,
  setFilters,
  setLastLoadedProjectId,
  clearCurrentCopy,
  clearError,
  updateCopyStatus,
  selectCopies,
  selectCurrentCopy,
  selectCopyFilters,
  selectCopiesLoading,
  selectCopiesError
} from '../store/slices/copiesSlice';
import { useNotifications } from './useNotifications';

// Track ongoing requests to prevent duplicates
let copiesLoadingPromise = null;

// Custom hook for managing copies
export const useCopies = () => {
  const dispatch = useDispatch();
  const { notifySuccess, notifyError, notifyInfo } = useNotifications();
  const { showLoading, hideLoading } = useLoading();
  
  const copies = useSelector(selectCopies) || [];
  const currentCopy = useSelector(selectCurrentCopy);
  const loadingState = useSelector(selectCopiesLoading);
  const errorState = useSelector(selectCopiesError);
  const filters = useSelector(selectCopyFilters);

  const [generatingFor, setGeneratingFor] = useState(null);

  // Fetch copies - stable function without filters dependency
  const loadCopies = useCallback(async (customFilters = {}, forceReload = false) => {
    // Skip if already loaded with same projectId and not forcing reload
    const currentState = store.getState().copies;
    const currentCopies = currentState.copies;
    const lastLoadedProjectId = currentState.lastLoadedProjectId;

    // Check if we already have copies for this project
    if (!forceReload && customFilters.projectId && customFilters.projectId === lastLoadedProjectId && currentCopies.length >= 0) {
      // Already loaded for this project, return existing copies
      return currentCopies;
    }

    // If there's an ongoing request, return that promise instead of making a new request
    if (copiesLoadingPromise && !forceReload) {
      console.log('Copies already loading, returning existing promise');
      return copiesLoadingPromise;
    }

    // Create the loading promise
    copiesLoadingPromise = (async () => {
      try {
        // Get current filters from Redux state directly
        const currentFilters = customFilters || {};
        const result = await dispatch(fetchCopies(currentFilters)).unwrap();

        // Track which project was loaded
        if (customFilters.projectId) {
          dispatch(setLastLoadedProjectId(customFilters.projectId));
        }

        return result;
      } catch (error) {
        console.error('Failed to load copies:', error);
        // Don't throw error to prevent component crashes
        return null;
      } finally {
        hideLoading('copies');
        copiesLoadingPromise = null; // Clear the promise when done
      }
    })();

    showLoading('copies', 'Loading copies...');
    return copiesLoadingPromise;
  }, [dispatch, showLoading, hideLoading]);

  // Fetch single copy
  const loadCopy = useCallback(async (copyId, options = {}) => {
    showLoading('copy', 'Loading copy details...');
    try {
      const result = await dispatch(fetchCopyById({ id: copyId, options })).unwrap();
      return result;
    } catch (error) {
      notifyError('Failed to load copy');
      throw error;
    } finally {
      hideLoading('copy');
    }
  }, [dispatch, notifyError, showLoading, hideLoading]);

  // Update existing copy locally
  const updateExistingCopy = useCallback((copyId, updates) => {
    // Update copy locally - not implemented in slice yet
    // dispatch(updateCopyLocally({ id: copyId, updates }));
    notifySuccess('Copy updated');
  }, [dispatch, notifySuccess]);

  // Update copy status
  const updateStatus = useCallback((copyId, status) => {
    dispatch(updateCopyStatus({ id: copyId, status }));
  }, [dispatch]);

  // Delete copy
  const removeCopy = useCallback(async (copyId) => {
    showLoading('deleteCopy', 'Deleting copy...');
    try {
      await dispatch(deleteCopy(copyId)).unwrap();
      notifySuccess('Copy deleted successfully');
    } catch (error) {
      notifyError('Failed to delete copy');
      throw error;
    } finally {
      hideLoading('deleteCopy');
    }
  }, [dispatch, notifySuccess, notifyError, showLoading, hideLoading]);

  // Generate copy
  const generateNewCopy = useCallback(async (params) => {
    showLoading('generateCopy', `Generating ${params.platform} copy... This may take a moment.`);
    try {
      setGeneratingFor(params.platform);
      const result = await dispatch(generateCopy(params)).unwrap();
      notifySuccess('Copy generated successfully');
      setGeneratingFor(null);
      return result;
    } catch (error) {
      notifyError('Failed to generate copy');
      setGeneratingFor(null);
      throw error;
    } finally {
      hideLoading('generateCopy');
    }
  }, [dispatch, notifySuccess, notifyError, showLoading, hideLoading]);

  // Fetch statistics - not implemented in slice yet
  const loadStatistics = useCallback(async () => {
    try {
      // const result = await dispatch(fetchCopyStatistics()).unwrap();
      // return result;
      return null; // Placeholder
    } catch (error) {
      notifyError('Failed to load statistics');
      throw error;
    }
  }, [dispatch, notifyError]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  // Clear states
  const clearCopy = useCallback(() => {
    dispatch(clearCurrentCopy());
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Get copies by platform
  const getCopiesByPlatform = useCallback((platform) => {
    return copies.filter(c => c.platform === platform);
  }, [copies]);

  // Get copies by project
  const getCopiesByProject = useCallback((projectId) => {
    return copies.filter(c => c.projectId === projectId);
  }, [copies]);

  // Get copies by format
  const getCopiesByFormat = useCallback((format) => {
    return copies.filter(c => c.format === format);
  }, [copies]);

  // Get top performing copies
  const getTopPerformingCopies = useCallback((limit = 5) => {
    return copies
      .filter(c => c.performance)
      .sort((a, b) => b.performance.views - a.performance.views)
      .slice(0, limit);
  }, [copies]);

  // Get copy stats
  const getCopyStats = useCallback(() => {
    const total = copies.length;
    const byPlatform = {};
    const byFormat = {};
    
    copies.forEach(copy => {
      byPlatform[copy.platform] = (byPlatform[copy.platform] || 0) + 1;
      byFormat[copy.format] = (byFormat[copy.format] || 0) + 1;
    });

    const totalViews = copies.reduce((sum, c) => sum + (c.performance?.views || 0), 0);
    const avgViews = total > 0 ? Math.floor(totalViews / total) : 0;

    return {
      total,
      byPlatform,
      byFormat,
      totalViews,
      avgViews,
      published: copies.filter(c => c.status === 'published').length,
      draft: copies.filter(c => c.status === 'draft').length
    };
  }, [copies]);

  return {
    copies,
    currentCopy,
    loading: loadingState?.fetch || false,  // Extract just the fetch loading state
    generateLoading: loadingState?.generate || false,
    error: errorState,
    filters,
    generatingFor,
    loadCopies,
    loadCopy,
    updateExistingCopy,
    updateStatus,
    removeCopy,
    generateNewCopy,
    loadStatistics,
    updateFilters,
    clearCopy,
    clearAllErrors,
    getCopiesByPlatform,
    getCopiesByProject,
    getCopiesByFormat,
    getTopPerformingCopies,
    getCopyStats
  };
};