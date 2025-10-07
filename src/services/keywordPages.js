import axiosInstance from '../api/axios';

class KeywordPagesService {
  // Get keyword pages with filters and pagination
  async getKeywordPages(params = {}) {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();

      // Add all parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const response = await axiosInstance.get(`/keywordPages?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch keyword pages');
    }
  }

  // Get single keyword page by ID
  async getKeywordPageById(id) {
    try {
      const response = await axiosInstance.get(`/keywordPages/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch keyword page details');
    }
  }

  // Get keyword pages with advanced filters
  async getKeywordPagesWithFilters(filters = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        link,
        keywordId,
        originManifestId,
        manifestId,
        pageNumber,
        stage,
        createdAt,
        pageNumberMin,
        pageNumberMax,
        search,
        sortProperty,
        sortType
      } = filters;

      const params = {
        page,
        limit,
        ...(link && { link }),
        ...(keywordId && { keywordId }),
        ...(originManifestId && { originManifestId }),
        ...(manifestId && { manifestId }),
        ...(pageNumber !== undefined && { pageNumber }),
        ...(stage && { stage }),
        ...(createdAt && { createdAt }),
        ...(pageNumberMin !== undefined && { pageNumberMin }),
        ...(pageNumberMax !== undefined && { pageNumberMax }),
        ...(search && { search }),
        ...(sortProperty && { sortProperty }),
        ...(sortType && { sortType })
      };

      return await this.getKeywordPages(params);
    } catch (error) {
      throw new Error('Failed to fetch keyword pages with filters');
    }
  }
}

// Create and export keyword pages service instance
const keywordPagesService = new KeywordPagesService();
export default keywordPagesService;
