import axiosInstance from '../api/axios';

class KeywordsService {
  // Get keywords with filters and pagination
  async getKeywords(params = {}) {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();

      // Add all parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await axiosInstance.get(`/keywords?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch keywords');
    }
  }

  // Get single keyword by ID
  async getKeywordById(id) {
    try {
      const response = await axiosInstance.get(`/keywords/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch keyword details');
    }
  }

  // Search keywords
  async searchKeywords(searchText, params = {}) {
    try {
      return await this.getKeywords({ ...params, search: searchText });
    } catch (error) {
      throw new Error('Failed to search keywords');
    }
  }

  // Get keywords with advanced filters
  async getKeywordsWithFilters(filters = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        keyword,
        keywordLink,
        createdAt,
        searchResultMin,
        searchResultMax,
        search,
        sortProperty,
        sortType
      } = filters;

      const params = {
        page,
        limit,
        ...(keyword && { keyword }),
        ...(keywordLink && { keywordLink }),
        ...(createdAt && { createdAt }),
        ...(searchResultMin !== undefined && { searchResultMin }),
        ...(searchResultMax !== undefined && { searchResultMax }),
        ...(search && { search }),
        ...(sortProperty && { sortProperty }),
        ...(sortType && { sortType })
      };

      return await this.getKeywords(params);
    } catch (error) {
      throw new Error('Failed to fetch keywords with filters');
    }
  }

  // Create a new keyword
  async createKeyword(keyword) {
    try {
      const response = await axiosInstance.post('/keywords/keyword', { keyword });
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create keyword');
    }
  }
}

// Create and export keywords service instance
const keywordsService = new KeywordsService();
export default keywordsService;
