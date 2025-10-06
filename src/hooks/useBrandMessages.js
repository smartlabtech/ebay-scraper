import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useLoading } from '../contexts/LoadingContext';
import { store } from '../store';
import {
  fetchBrandMessages,
  fetchBrandMessageById,
  createBrandMessage,
  deleteBrandMessage,
  setLastLoadedProjectId,
  clearCurrentMessage,
  clearError,
  selectBrandMessages,
  selectCurrentMessage,
  selectBrandMessagesPagination,
  selectBrandMessagesLoading,
  selectBrandMessagesError,
  selectBrandMessagesCreating,
  selectBrandMessagesDeleting
} from '../store/slices/brandMessagesSlice';

// Track ongoing requests to prevent duplicates
let brandMessagesLoadingPromise = null;

export const useBrandMessages = () => {
  const dispatch = useDispatch();
  const { showLoading, hideLoading } = useLoading();
  
  // Selectors
  const messages = useSelector(selectBrandMessages);
  const currentMessage = useSelector(selectCurrentMessage);
  const pagination = useSelector(selectBrandMessagesPagination);
  const loading = useSelector(selectBrandMessagesLoading);
  const error = useSelector(selectBrandMessagesError);
  const creating = useSelector(selectBrandMessagesCreating);
  const deleting = useSelector(selectBrandMessagesDeleting);

  // Actions
  const loadMessages = useCallback(async (params = {}, forceReload = false) => {
    // Skip if already loaded with same projectId and not forcing reload
    const currentState = store.getState().brandMessages;
    const currentMessages = currentState.messages;
    const lastLoadedProjectId = currentState.lastLoadedProjectId;

    // Check if we already have messages for this project
    if (!forceReload && params.projectId && params.projectId === lastLoadedProjectId && currentMessages.length >= 0) {
      // Already loaded for this project, return existing messages
      return currentMessages;
    }

    // If there's an ongoing request, return that promise instead of making a new request
    if (brandMessagesLoadingPromise && !forceReload) {
      console.log('Brand messages already loading, returning existing promise');
      return brandMessagesLoadingPromise;
    }

    // Create the loading promise
    brandMessagesLoadingPromise = (async () => {
      try {
        const result = await dispatch(fetchBrandMessages(params));

        // Track which project was loaded
        if (params.projectId) {
          dispatch(setLastLoadedProjectId(params.projectId));
        }

        return result.payload;
      } finally {
        hideLoading('brandMessages');
        brandMessagesLoadingPromise = null; // Clear the promise when done
      }
    })();

    showLoading('brandMessages', 'Loading brand messages...');
    return brandMessagesLoadingPromise;
  }, [dispatch, showLoading, hideLoading]);

  const loadMessageById = useCallback(async (id) => {
    showLoading('brandMessage', 'Loading brand message details...');
    try {
      const result = await dispatch(fetchBrandMessageById(id));
      return result.payload;
    } finally {
      hideLoading('brandMessage');
    }
  }, [dispatch, showLoading, hideLoading]);

  const generateMessage = useCallback(async (data) => {
    showLoading('generateMessage', 'Generating brand message... This may take a moment.');
    try {
      const result = await dispatch(createBrandMessage(data));
      if (createBrandMessage.fulfilled.match(result)) {
        return result.payload;
      }
      // Handle error response structure
      const errorMessage = result.payload?.message || result.payload || 'Failed to generate brand message';
      throw new Error(errorMessage);
    } finally {
      hideLoading('generateMessage');
    }
  }, [dispatch, showLoading, hideLoading]);

  const removeMessage = useCallback(async (id) => {
    showLoading('deleteMessage', 'Deleting brand message...');
    try {
      const result = await dispatch(deleteBrandMessage(id));
      if (deleteBrandMessage.fulfilled.match(result)) {
        return result.payload;
      }
      // Handle error response structure
      const errorMessage = result.payload?.message || result.payload || 'Failed to delete brand message';
      throw new Error(errorMessage);
    } finally {
      hideLoading('deleteMessage');
    }
  }, [dispatch, showLoading, hideLoading]);

  const clearCurrent = useCallback(() => {
    dispatch(clearCurrentMessage());
  }, [dispatch]);

  const clearBrandMessageError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // State
    messages,
    currentMessage,
    pagination,
    loading,
    error,
    creating,
    deleting,
    
    // Actions
    loadMessages,
    loadMessageById,
    generateMessage,
    removeMessage,
    clearCurrent,
    clearError: clearBrandMessageError
  };
};