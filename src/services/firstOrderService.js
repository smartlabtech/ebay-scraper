import axiosInstance from '../api/axios';

class FirstOrderService {
  /**
   * Create first order with signup
   * This endpoint creates a new user account and subscribes them to a plan
   * @param {Object} data - User signup data with plan selection
   * @param {string} data.planId - Selected plan ID
   * @param {string} data.firstName - User's first name
   * @param {string} data.lastName - User's last name
   * @param {string} data.email - User's email
   * @param {string} data.password - User's password
   * @param {Object} data.fbPixelData - Facebook Pixel tracking data
   * @returns {Promise<Object>} Response with token, user, orderId, subscriptionId, and message
   */
  async createFirstOrder(data) {
    try {
      // Send all data including fbPixelData
      const response = await axiosInstance.post('/en/subscription/first-order', data);

      return response.data;
    } catch (error) {
      // Handle specific error cases
      if (error.response?.status === 409) {
        throw new Error('Email already registered. Please login instead.');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Invalid input data. Please check your information.');
      }
      if (error.response?.status === 404) {
        throw new Error('Selected plan not found. Please refresh and try again.');
      }

      console.error('Error creating first order:', error);
      throw error.response?.data || error;
    }
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with isValid and message
   */
  validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_]/.test(password);

    if (password.length < minLength) {
      return { isValid: false, message: `Password must be at least ${minLength} characters long` };
    }
    if (!hasUpperCase) {
      return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!hasLowerCase) {
      return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!hasNumbers) {
      return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!hasSpecialChar) {
      return { isValid: false, message: 'Password must contain at least one special character' };
    }

    return { isValid: true, message: 'Password is strong' };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} Is valid email
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

const firstOrderService = new FirstOrderService();
export default firstOrderService;