import axiosInstance from '../api/axios';

class ManifestsService {
  // Get manifests with filters and pagination
  async getManifests(params = {}) {
    try {
      // Build query string from params
      const queryParams = new URLSearchParams();

      // Add all parameters to query string
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          // Handle array parameters (e.g., excludeStatus)
          if (Array.isArray(value)) {
            value.forEach(item => {
              queryParams.append(key, item);
            });
          } else {
            queryParams.append(key, value);
          }
        }
      });

      const response = await axiosInstance.get(`/manifests?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch manifests');
    }
  }

  // Get single manifest by ID
  async getManifestById(id) {
    try {
      const response = await axiosInstance.get(`/manifests/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to fetch manifest details');
    }
  }

  // Get manifests with advanced filters
  async getManifestsWithFilters(filters = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        type,
        status,
        excludeStatus,
        _id,
        scrapingjobId,
        scrapingjobStatus,
        trialsMin,
        trialsMax,
        createdAt,
        sortProperty,
        sortType
      } = filters;

      const params = {
        page,
        limit,
        ...(type && { type }),
        ...(status && { status }),
        ...(excludeStatus && excludeStatus.length > 0 && { excludeStatus }),
        ...(_id && { _id }),
        ...(scrapingjobId && { scrapingjobId }),
        ...(scrapingjobStatus && { scrapingjobStatus }),
        ...(trialsMin !== undefined && { trialsMin }),
        ...(trialsMax !== undefined && { trialsMax }),
        ...(createdAt && { createdAt }),
        ...(sortProperty && { sortProperty }),
        ...(sortType && { sortType })
      };

      return await this.getManifests(params);
    } catch (error) {
      throw new Error('Failed to fetch manifests with filters');
    }
  }

  // Create a new manifest
  async createManifest(data) {
    try {
      const response = await axiosInstance.post('/manifests', data);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to create manifest');
    }
  }

  // Send manifest to scrape
  async sendManifestToScrap(data) {
    try {
      const response = await axiosInstance.post('/manifests/manifest-to-scrap', data);
      return response.data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Failed to send manifest to scrap');
    }
  }
}

// Create and export manifests service instance
const manifestsService = new ManifestsService();
export default manifestsService;
