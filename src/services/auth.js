import axiosInstance from '../api/axios';
import { STORAGE_KEYS } from '../types';
import { clearAllServiceCaches } from './clearServiceCaches';

class AuthService {
  // Login
  async login(email, password) {
    try {
      const response = await axiosInstance.post('/en/auth/signin', {
        email,
        password
      });

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      // Store auth data
      if (responseData.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, responseData.token);
      }
      
      if (responseData.user) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(responseData.user));
      }

      return {
        token: responseData.token,
        user: responseData.user
      };
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Login failed. Please try again.');
    }
  }

  // Register
  async register(userData) {
    try {
      const response = await axiosInstance.post('/en/auth/signup', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password
      });

      // Check if response has nested data property or direct properties
      const responseData = response.data.data || response.data;
      
      // Store auth data if auto-login after registration
      if (responseData.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, responseData.token);
      }
      
      if (responseData.user) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(responseData.user));
      }

      return {
        token: responseData.token,
        user: responseData.user
      };
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Registration failed. Please try again.');
    }
  }

  // Logout
  async logout() {
    // Clear local storage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);

    // Clear project selection
    localStorage.removeItem('selectedProjectId');

    // Clear all service caches to prevent data leakage
    clearAllServiceCaches();

    // Optionally call logout endpoint if your backend has one
    try {
      await axiosInstance.post('/en/auth/logout');
    } catch (error) {
      // Ignore logout endpoint errors
    }

    return { success: true };
  }

  // Get current user
  getCurrentUser() {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  // Get auth token
  getAuthToken() {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  // Check if authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await axiosInstance.post('/en/auth/refresh');
      const { data } = response.data;
      
      if (data.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, data.token);
      }

      return { token: data.token };
    } catch (error) {
      throw new Error('Token refresh failed');
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await axiosInstance.get(`/en/auth/forgot-password/${encodeURIComponent(email)}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to send reset email');
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await axiosInstance.post('/en/auth/reset-password', {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to reset password');
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await axiosInstance.get(`/en/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Email verification failed');
    }
  }

  // Resend verification email
  async resendVerificationEmail() {
    try {
      const response = await axiosInstance.post('/en/auth/resend-verification');
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to resend verification email');
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await axiosInstance.post('/en/auth/change-password', {
        newPassword
      });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to change password');
    }
  }

  // Update profile
  async updateProfile(updates) {
    try {
      const response = await axiosInstance.patch('/en/user/profile', updates);
      
      // The response contains both token and user
      const { token, user } = response.data;
      
      // Update token if provided
      if (token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      }
      
      // Update user data
      if (user) {
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to update profile');
    }
  }

  // Upload avatar
  async uploadAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await axiosInstance.post('/en/auth/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const { data } = response.data;
      
      if (data) {
        const currentUser = this.getCurrentUser();
        const updatedUser = { ...currentUser, avatar: data.avatarUrl };
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
      }
      
      return data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to upload avatar');
    }
  }

  // Initialize auth on app start
  initialize() {
    // Token is automatically added by axios interceptor
  }
}

// Create and export auth service instance
const authService = new AuthService();
authService.initialize();

export default authService;