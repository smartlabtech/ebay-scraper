import axiosInstance from '../api/axios';

class StoresService {
  // Get stores with filters and pagination
  async getStores(params = {}) {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();

      // Add all parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await axiosInstance.get(`/stores?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch stores');
    }
  }

  // Get single store by ID
  async getStoreById(id) {
    try {
      const response = await axiosInstance.get(`/stores/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch store details');
    }
  }

  // Search stores
  async searchStores(searchText, params = {}) {
    try {
      return await this.getStores({ ...params, search: searchText });
    } catch (error) {
      throw new Error('Failed to search stores');
    }
  }

  // Get stores by location
  async getStoresByLocation(location, params = {}) {
    try {
      return await this.getStores({ ...params, location });
    } catch (error) {
      throw new Error(`Failed to fetch stores in ${location}`);
    }
  }

  // Get stores with advanced filters
  async getStoresWithFilters(filters = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        location,
        storeLink,
        createdAt,
        memberSince,
        memberSinceBefore,
        soldMin,
        soldMax,
        searchAllMin,
        searchAllMax,
        search,
        sortProperty,
        sortType
      } = filters;

      const params = {
        page,
        limit,
        ...(location && { location }),
        ...(storeLink && { storeLink }),
        ...(createdAt && { createdAt }),
        ...(memberSince && { memberSince }),
        ...(memberSinceBefore && { memberSinceBefore }),
        ...(soldMin !== undefined && { soldMin }),
        ...(soldMax !== undefined && { soldMax }),
        ...(searchAllMin !== undefined && { searchAllMin }),
        ...(searchAllMax !== undefined && { searchAllMax }),
        ...(search && { search }),
        ...(sortProperty && { sortProperty }),
        ...(sortType && { sortType })
      };

      return await this.getStores(params);
    } catch (error) {
      throw new Error('Failed to fetch stores with filters');
    }
  }
}

// Create and export stores service instance
const storesService = new StoresService();
export default storesService;