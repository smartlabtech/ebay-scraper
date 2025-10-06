import axiosInstance from '../api/axios';

class OrdersService {
  constructor() {
    // Track ongoing requests to prevent duplicates
    this.pendingOrdersPromise = null;
  }
  /**
   * Initiate a subscription order
   * @param {string} planId - The ID of the plan to subscribe to
   * @returns {Promise<Object>} - Order response containing orderId, paymentUrl, etc.
   */
  async initiateSubscription(planId) {
    try {
      const response = await axiosInstance.post('/en/subscription/initiate', {
        planId
      });

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      return {
        orderId: responseData.orderId,
        paymentUrl: responseData.paymentUrl,
        amount: responseData.amount,
        currency: responseData.currency,
        status: responseData.status || 'pending',
        expiresAt: responseData.expiresAt,
        planId: responseData.plan?.id || responseData.planId,
        planName: responseData.plan?.name || responseData.planName,
        billingCycle: responseData.plan?.billingCycle,
        description: responseData.description,
        paymentRequired: responseData.paymentRequired
      };
    } catch (error) {
      // Handle different error scenarios
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Invalid subscription request');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to create this subscription');
      } else if (error.response?.status === 409) {
        throw new Error('You already have an active subscription for this plan');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to initiate subscription. Please try again.');
    }
  }

  /**
   * Get all pending orders for the current user
   * @returns {Promise<Array>} - Array of pending orders
   */
  async getPendingOrders() {
    try {
      // Check if pending orders are already being fetched
      if (this.pendingOrdersPromise) {
        console.log('Pending orders already being fetched, reusing existing request');
        return this.pendingOrdersPromise;
      }

      // Create the request promise
      this.pendingOrdersPromise = axiosInstance.get('/en/order/pending')
        .then(response => {
          // Check if response has nested data property or direct properties
          const responseData = response.data.data || response.data;

          // Ensure we return an array
          const orders = Array.isArray(responseData) ? responseData : [responseData].filter(Boolean);

          return orders.map(order => ({
            orderId: order._id,
            orderNumber: order.orderNumber,
            planId: order.items?.[0]?.referenceId || order.planId,
            planName: order.items?.[0]?.metadata?.planName || order.planName,
            amount: order.total || order.amount,
            currency: order.currency,
            status: order.status,
            createdAt: order.createdAt,
            expiresAt: order.expiresAt,
            paymentUrl: order.paymentUrl,
            description: order.items?.[0]?.description || order.description,
            type: order.type || 'subscription',
            paymentStatus: order.paymentStatus,
            paymentIntentId: order.paymentIntentId,
            items: order.items
          }));
        })
        .catch(error => {
          // Handle different error scenarios
          if (error.response?.status === 401) {
            throw new Error('Authentication required. Please log in again.');
          } else if (error.response?.status === 403) {
            throw new Error('You do not have permission to view orders');
          } else if (error.response?.status === 404) {
            // No pending orders found - return empty array
            return [];
          } else if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          }
          throw new Error('Failed to fetch pending orders. Please try again.');
        })
        .finally(() => {
          // Clean up after completion
          this.pendingOrdersPromise = null;
        });

      return this.pendingOrdersPromise;
    } catch (error) {
      console.error('Error in getPendingOrders:', error);
      throw error;
    }
  }

  /**
   * Get order details by ID
   * @param {string} orderId - The order ID to fetch
   * @returns {Promise<Object>} - Order details
   */
  async getOrderById(orderId) {
    try {
      const response = await axiosInstance.get(`/en/order/${orderId}`);

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      return {
        orderId: responseData.orderId,
        planId: responseData.planId,
        planName: responseData.planName,
        amount: responseData.amount,
        currency: responseData.currency,
        status: responseData.status,
        createdAt: responseData.createdAt,
        expiresAt: responseData.expiresAt,
        paymentUrl: responseData.paymentUrl,
        description: responseData.description,
        type: responseData.type || 'subscription',
        paymentMethod: responseData.paymentMethod,
        transactionId: responseData.transactionId
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to view this order');
      } else if (error.response?.status === 404) {
        throw new Error('Order not found');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch order details. Please try again.');
    }
  }

  /**
   * Cancel a pending order
   * @param {string} orderId - The order ID to cancel
   * @returns {Promise<Object>} - Cancellation response
   */
  async cancelOrder(orderId) {
    try {
      const response = await axiosInstance.post(`/en/order/${orderId}/cancel`);

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      return {
        orderId: responseData.orderId,
        status: responseData.status,
        message: responseData.message || 'Order cancelled successfully'
      };
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Cannot cancel this order');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to cancel this order');
      } else if (error.response?.status === 404) {
        throw new Error('Order not found');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to cancel order. Please try again.');
    }
  }

  /**
   * Retry payment for a failed order
   * @param {string} orderId - The order ID to retry payment for
   * @returns {Promise<Object>} - Retry payment response
   */
  async retryPayment(orderId) {
    try {
      const response = await axiosInstance.post(`/en/order/${orderId}/retry`);

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      return {
        orderId: responseData.orderId,
        paymentUrl: responseData.paymentUrl,
        status: responseData.status,
        expiresAt: responseData.expiresAt
      };
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'Cannot retry payment for this order');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to retry payment for this order');
      } else if (error.response?.status === 404) {
        throw new Error('Order not found');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to retry payment. Please try again.');
    }
  }

  /**
   * Check order status
   * @param {string} orderId - The order ID to check
   * @returns {Promise<Object>} - Order status response
   */
  async checkOrderStatus(orderId) {
    try {
      const response = await axiosInstance.get(`/en/order/${orderId}/status`);

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      return {
        orderId: responseData.orderId,
        status: responseData.status,
        paymentStatus: responseData.paymentStatus,
        updatedAt: responseData.updatedAt
      };
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to check this order status');
      } else if (error.response?.status === 404) {
        throw new Error('Order not found');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to check order status. Please try again.');
    }
  }
}

// Create and export orders service instance
const ordersService = new OrdersService();

export default ordersService;