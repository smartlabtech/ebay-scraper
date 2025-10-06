import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  initiateSubscription,
  fetchPendingOrders,
  fetchOrderById,
  cancelOrder,
  retryPayment,
  checkOrderStatus,
  createPaymentCheckout,
  clearCurrentOrder,
  clearError,
  clearAllErrors,
  updatePendingOrder,
  removePendingOrder,
  resetOrdersState,
  selectPendingOrders,
  selectCurrentOrder,
  selectOrdersLoading,
  selectOrdersError,
  selectLastUpdated,
  selectHasPendingOrders,
  selectIsInitiatingOrder,
  selectIsFetchingPendingOrders,
  selectOrdersErrorMessages,
  selectOrderById,
  selectExpiredOrders,
  selectOrdersExpiringSoon
} from '../store/slices/ordersSlice';

/**
 * Custom hook for managing orders
 * Provides access to order state and functions to interact with orders
 */
export const useOrders = () => {
  const dispatch = useDispatch();

  // Selectors
  const pendingOrders = useSelector(selectPendingOrders);
  const currentOrder = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrdersLoading);
  const error = useSelector(selectOrdersError);
  const lastUpdated = useSelector(selectLastUpdated);
  const hasPendingOrders = useSelector(selectHasPendingOrders);
  const isInitiatingOrder = useSelector(selectIsInitiatingOrder);
  const isFetchingPendingOrders = useSelector(selectIsFetchingPendingOrders);
  const errorMessages = useSelector(selectOrdersErrorMessages);
  const expiredOrders = useSelector(selectExpiredOrders);
  const ordersExpiringSoon = useSelector(selectOrdersExpiringSoon);

  // Actions
  
  /**
   * Initiate a subscription for a specific plan
   * @param {string} planId - The ID of the plan to subscribe to
   * @returns {Promise<Object>} - The created order
   */
  const initiateSubscriptionOrder = useCallback(async (planId) => {
    try {
      const result = await dispatch(initiateSubscription(planId)).unwrap();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }, [dispatch]);

  /**
   * Fetch all pending orders
   * @returns {Promise<Array>} - Array of pending orders
   */
  const getPendingOrders = useCallback(async () => {
    try {
      const result = await dispatch(fetchPendingOrders()).unwrap();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }, [dispatch]);

  /**
   * Get order details by ID
   * @param {string} orderId - The order ID to fetch
   * @returns {Promise<Object>} - Order details
   */
  const getOrderById = useCallback(async (orderId) => {
    try {
      const result = await dispatch(fetchOrderById(orderId)).unwrap();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }, [dispatch]);

  /**
   * Cancel a pending order
   * @param {string} orderId - The order ID to cancel
   * @returns {Promise<Object>} - Cancellation result
   */
  const cancelPendingOrder = useCallback(async (orderId) => {
    try {
      const result = await dispatch(cancelOrder(orderId)).unwrap();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }, [dispatch]);

  /**
   * Retry payment for a failed order
   * @param {string} orderId - The order ID to retry payment for
   * @returns {Promise<Object>} - Retry result
   */
  const retryOrderPayment = useCallback(async (orderId) => {
    try {
      const result = await dispatch(retryPayment(orderId)).unwrap();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }, [dispatch]);

  /**
   * Create payment checkout for an order
   * @param {string} orderId - The order ID to create checkout for
   * @returns {Promise<Object>} - Checkout result
   */
  const createCheckout = useCallback(async (orderId) => {
    try {
      const result = await dispatch(createPaymentCheckout(orderId)).unwrap();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }, [dispatch]);

  // Removed getOrderStatus as the endpoint is not available for client
  // Order status is updated by refreshing the pending orders list

  /**
   * Clear the current order from state
   */
  const clearOrder = useCallback(() => {
    dispatch(clearCurrentOrder());
  }, [dispatch]);

  /**
   * Clear a specific error
   * @param {string} errorType - The type of error to clear
   */
  const clearSpecificError = useCallback((errorType) => {
    dispatch(clearError(errorType));
  }, [dispatch]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  /**
   * Update an existing order in the pending orders list
   * @param {string} orderId - The order ID to update
   * @param {Object} updates - The updates to apply
   */
  const updateOrder = useCallback((orderId, updates) => {
    dispatch(updatePendingOrder({ orderId, updates }));
  }, [dispatch]);

  /**
   * Remove an order from the pending orders list
   * @param {string} orderId - The order ID to remove
   */
  const removeOrder = useCallback((orderId) => {
    dispatch(removePendingOrder(orderId));
  }, [dispatch]);

  /**
   * Reset the entire orders state
   */
  const resetState = useCallback(() => {
    dispatch(resetOrdersState());
  }, [dispatch]);

  /**
   * Get a specific order from pending orders by ID
   * @param {string} orderId - The order ID to find
   * @returns {Object|undefined} - The order if found
   */
  const findOrderById = useCallback((orderId) => {
    return pendingOrders.find(order => order.orderId === orderId);
  }, [pendingOrders]);

  /**
   * Check if an order is expired
   * @param {Object} order - The order to check
   * @returns {boolean} - True if expired
   */
  const isOrderExpired = useCallback((order) => {
    if (!order.expiresAt) return false;
    return new Date(order.expiresAt) < new Date();
  }, []);

  /**
   * Check if an order is expiring soon (within 1 hour)
   * @param {Object} order - The order to check
   * @returns {boolean} - True if expiring soon
   */
  const isOrderExpiringSoon = useCallback((order) => {
    if (!order.expiresAt) return false;
    const now = new Date();
    const expiryDate = new Date(order.expiresAt);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    return expiryDate > now && expiryDate <= oneHourFromNow;
  }, []);

  /**
   * Get the time remaining until an order expires
   * @param {Object} order - The order to check
   * @returns {Object} - Object with days, hours, minutes, seconds remaining
   */
  const getTimeRemaining = useCallback((order) => {
    if (!order.expiresAt) return null;
    
    const now = new Date();
    const expiryDate = new Date(order.expiresAt);
    const timeDiff = expiryDate - now;
    
    if (timeDiff <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    return { expired: false, days, hours, minutes, seconds };
  }, []);


  return {
    // State
    pendingOrders,
    currentOrder,
    loading,
    error,
    lastUpdated,
    hasPendingOrders,
    isInitiatingOrder,
    isFetchingPendingOrders,
    errorMessages,
    expiredOrders,
    ordersExpiringSoon,

    // Actions
    initiateSubscriptionOrder,
    getPendingOrders,
    getOrderById,
    cancelPendingOrder,
    retryOrderPayment,
    createCheckout,
    clearOrder,
    clearSpecificError,
    clearErrors,
    updateOrder,
    removeOrder,
    resetState,

    // Utilities
    findOrderById,
    isOrderExpired,
    isOrderExpiringSoon,
    getTimeRemaining
  };
};

export default useOrders;