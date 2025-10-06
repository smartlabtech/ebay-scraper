import axiosInstance from '../api/axios';

class OrdersService {
  constructor() {
    // Track ongoing GET requests to prevent duplicates
    this.getOrderPromises = new Map();
  }
  // Get all orders for admin with filters
  async getAdminOrders(params = {}) {
    try {
      // Build query string manually to ensure proper encoding
      const queryParams = [];

      // Add pagination
      queryParams.push(`limit=${Math.min(params.limit || 50, 100)}`);
      queryParams.push(`skip=${params.skip || 0}`);

      // Add sorting
      if (params.sortBy) {
        queryParams.push(`sortBy=${params.sortBy}`);
      }
      if (params.sortOrder) {
        queryParams.push(`sortOrder=${params.sortOrder}`);
      }

      // Add filters
      if (params.userId) {
        queryParams.push(`userId=${params.userId}`);
      }

      if (params.status) {
        queryParams.push(`status=${params.status}`);
      }

      if (params.type) {
        queryParams.push(`type=${params.type}`);
      }

      // Add date filters with proper encoding
      if (params.startDate) {
        const startDate = new Date(params.startDate);
        startDate.setHours(0, 0, 0, 0);
        const encodedDate = startDate.toISOString().replace(/:/g, '%3A');
        queryParams.push(`startDate=${encodedDate}`);
      }

      if (params.endDate) {
        const endDate = new Date(params.endDate);
        endDate.setHours(23, 59, 59, 999);
        const encodedDate = endDate.toISOString().replace(/:/g, '%3A');
        queryParams.push(`endDate=${encodedDate}`);
      }

      if (params.day) {
        queryParams.push(`day=${params.day}`);
      }

      if (params.month !== undefined) {
        queryParams.push(`month=${params.month}`);
      }

      if (params.year !== undefined) {
        queryParams.push(`year=${params.year}`);
      }

      // Add amount filters
      if (params.minAmount !== undefined) {
        queryParams.push(`minAmount=${params.minAmount}`);
      }

      if (params.maxAmount !== undefined) {
        queryParams.push(`maxAmount=${params.maxAmount}`);
      }

      const url = `/en/order/admin/all?${queryParams.join('&')}`;
      const response = await axiosInstance.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId) {
    try {
      // Check if this order is already being fetched
      if (this.getOrderPromises.has(orderId)) {
        console.log(`Order ${orderId} already being fetched, reusing existing request`);
        return this.getOrderPromises.get(orderId);
      }

      // Create the request promise
      const orderPromise = axiosInstance.get(`/en/order/${orderId}`)
        .then(response => response.data)
        .catch(error => {
          console.error('Error fetching order:', error);
          throw error;
        });

      // Store the promise
      this.getOrderPromises.set(orderId, orderPromise);

      // Clean up after completion
      orderPromise.finally(() => {
        this.getOrderPromises.delete(orderId);
      });

      return orderPromise;
    } catch (error) {
      console.error('Error in getOrderById:', error);
      throw error;
    }
  }

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const response = await axiosInstance.patch(`/en/order/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Process refund
  async processRefund(orderId, amount, reason) {
    try {
      const response = await axiosInstance.post(`/en/order/${orderId}/refund`, {
        amount,
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  }
}

const ordersService = new OrdersService();
export default ordersService;