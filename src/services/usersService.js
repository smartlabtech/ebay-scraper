import axiosInstance from '../api/axios';

class UsersService {
  // Get all users
  async getUsers(params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 20,
        search: params.search,
        role: params.role,
        status: params.status
      };

      // Remove undefined params
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await axiosInstance.get('/en/user', { params: queryParams });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get single user
  async getUser(userId) {
    try {
      const response = await axiosInstance.get(`/en/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(userId, updates) {
    try {
      const response = await axiosInstance.patch(`/en/user/${userId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Update user credits
  async updateUserCredits(userId, credits) {
    try {
      const response = await axiosInstance.patch(`/en/user/${userId}/credits`, { credits });
      return response.data;
    } catch (error) {
      console.error('Error updating user credits:', error);
      throw error;
    }
  }

  // Update user role
  async updateUserRole(userId, role) {
    try {
      const response = await axiosInstance.patch(`/en/user/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  // Block/Unblock user
  async toggleUserStatus(userId, isBlocked) {
    try {
      const response = await axiosInstance.patch(`/en/user/${userId}/status`, { isBlocked });
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      await axiosInstance.delete(`/en/user/${userId}`);
      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Reset user password
  async resetUserPassword(userId) {
    try {
      const response = await axiosInstance.post(`/en/user/${userId}/reset-password`);
      return response.data;
    } catch (error) {
      console.error('Error resetting user password:', error);
      throw error;
    }
  }
}

const usersService = new UsersService();
export default usersService;